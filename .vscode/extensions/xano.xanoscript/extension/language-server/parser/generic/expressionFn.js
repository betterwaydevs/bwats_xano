import { ExclamationToken } from "../../lexer/cast.js";
import {
  AndTestToken,
  ColonToken,
  Divide,
  GreaterThan,
  GreaterThanOrEq,
  IsEqual,
  IsNotEqual,
  IsStrictEqual,
  IsStrictNotEqual,
  JsonBetweenToken,
  JsonContainsStringToken,
  JsonContainsToken,
  JsonEqualToken,
  JsonILikeToken,
  JsonIncludesToken,
  JsonLikeToken,
  JsonNotBetweenToken,
  JsonNotContainsToken,
  JsonNotILikeToken,
  JsonNotIncludesToken,
  JsonNotInToken,
  JsonNotLikeToken,
  JsonNotOverlapsToken,
  JsonNotRegexToken,
  JsonOverlapsToken,
  JsonRegexToken,
  JsonSearchToken,
  LParent,
  Minus,
  Modulus,
  Multiply,
  NullishCoalescingToken,
  OrTestToken,
  PipeToken,
  Plus,
  Question,
  RParent,
  SmallerThan,
  SmallerThanOrEq,
} from "../../lexer/control.js";
import {
  ExpressionLiteral,
  FloatLiteral,
  IntegerLiteral,
  SingleQuotedStringLiteral,
  StringLiteral,
} from "../../lexer/literal.js";
import {
  MultiLineExpressionToken,
  MultiLineStringToken,
} from "../../lexer/multiline.js";
import {
  DotToken,
  FalseToken,
  Identifier,
  JsonInToken,
  NewlineToken,
  NowToken,
  NullToken,
  TrueToken,
} from "../../lexer/tokens.js";

const DEFAULT_OPTIONS = {
  allowQueryExpression: false,
  allowIdentifier: true, // in some cases, an expression can not reference an identifier
  allowVariables: true,
  allowDisabledKeys: false, // allow keys to be disabled with a "!" in objectWithAttributes
};

const OperatorAcceptingOptionalIfNull = [
  GreaterThan,
  GreaterThanOrEq,
  SmallerThan,
  SmallerThanOrEq,
  IsStrictEqual,
  IsEqual,
  IsStrictNotEqual,
  IsNotEqual,
  JsonInToken,
  JsonNotBetweenToken,
  JsonNotContainsToken,
  JsonNotILikeToken,
  JsonNotIncludesToken,
  JsonNotInToken,
  JsonBetweenToken,
  JsonContainsToken,
  JsonContainsStringToken,
  JsonILikeToken,
  JsonIncludesToken,
  JsonLikeToken,
  JsonNotLikeToken,
  JsonNotOverlapsToken,
  JsonNotRegexToken,
  JsonOverlapsToken,
];

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @param {import('chevrotain').TokenType} token
 * @returns
 */
export function expressionFn($) {
  return (token, options = {}) => {
    options = { ...DEFAULT_OPTIONS, ...options };

    let hasFilters = false;
    let hasTests = false;
    let has_ternary = false;

    $.OR([
      {
        ALT: () => {
          $.MANY1(() => $.CONSUME(ExclamationToken));
          $.OR2([
            {
              ALT: () => {
                // could be an isolated expression (...expression...)
                $.CONSUME(LParent);
                $.OR3([
                  {
                    ALT: () =>
                      $.SUBRULE($.expressionFn, { ARGS: [token, options] }),
                  },
                  {
                    // some filters can be used as standalone value (e.g., `(|uuid)`)
                    // bug have to be inside parentheses
                    ALT: () =>
                      $.SUBRULE($.multilineFilterFn, { ARGS: [options] }),
                  },
                ]);
                $.OPTION(() => $.CONSUME1(NewlineToken));
                $.CONSUME(RParent);
                $.MANY(() => {
                  $.CONSUME(DotToken);
                  $.CONSUME(Identifier);
                });
              },
            },
            {
              ALT: () =>
                // could just be an expression literal
                $.SUBRULE($.simpleExpressionFn, { ARGS: [token, options] }),
            },
          ]);
        },
      },
      // could be a list of expressions separated by commas or new lines
      {
        ALT: () => {
          $.SUBRULE($.schemaParseArrayFn, {
            ARGS: [
              token,
              options.allowQueryExpression ? ["[query]"] : ["[expression]"],
            ],
          });
        },
      },
      // could be an object with attributes
      {
        ALT: () => {
          const keyType = options.allowDisabledKeys
            ? `![string]?`
            : "[string]?";

          $.SUBRULE($.schemaParseObjectFn, {
            ARGS: [
              token,
              {
                [keyType]: options.allowQueryExpression
                  ? "[query]"
                  : "[expression]",
              },
            ],
          });
          $.SUBRULE($.chainedIdentifier);
        },
      },
    ]);

    $.MANY2(() => {
      $.SUBRULE($.bracketArrayAccessor);
    });

    $.MANY3({
      // This is a tricky one, we allow a new line breaking an expression but only
      // if the following line is a filter (starts with a pipe)
      // We use LookAhead to peek at the next tokens without consuming them
      // to decide if we should close or keep the gate open
      GATE: () =>
        $.LA(1).tokenType === PipeToken ||
        ($.LA(1).tokenType === NewlineToken && $.LA(2).tokenType === PipeToken),
      DEF: () => {
        hasFilters = true;
        $.SUBRULE($.filterFn, { ARGS: [options] });
      },
    });

    const testToken = $.OPTION1(() => {
      hasTests = true;
      return $.OR1([
        {
          ALT: () => $.SUBRULE($.expressionTestFn, { ARGS: [token, options] }),
        },
        {
          ALT: () => {
            has_ternary = true;
            const token = $.CONSUME(Question); // "?"
            $.SUBRULE2($.expressionFn, { ARGS: [token, options] });
            $.CONSUME2(ColonToken); // ":"
            $.SUBRULE3($.expressionFn, { ARGS: [token, options] });
            return token;
          },
        },
      ]);
    });

    if (hasFilters && hasTests) {
      $.addInvalidValueError(
        token,
        "An expression should be wrapped in parentheses when combining filters and tests"
      );
    }

    if (options.allowQueryExpression && has_ternary) {
      $.addInvalidValueError(
        testToken,
        "Ternary expressions are not allowed in a where clause"
      );
    }
  };
}

export function expressionTestFn($) {
  return (token, options = {}) => {
    const operator = $.OR([
      { ALT: () => $.CONSUME(GreaterThan) }, // ">"
      { ALT: () => $.CONSUME(GreaterThanOrEq) }, // ">="
      { ALT: () => $.CONSUME(SmallerThan) }, // "<"
      { ALT: () => $.CONSUME(SmallerThanOrEq) }, // "<="
      { ALT: () => $.CONSUME(IsStrictEqual) }, // "==="
      { ALT: () => $.CONSUME(IsEqual) }, // "=="
      { ALT: () => $.CONSUME(IsStrictNotEqual) }, // "!=="
      { ALT: () => $.CONSUME(IsNotEqual) }, // "!="
      { ALT: () => $.CONSUME(Plus) }, // "+"
      { ALT: () => $.CONSUME(Minus) }, // "-"
      { ALT: () => $.CONSUME(Multiply) }, // "*"
      { ALT: () => $.CONSUME(Divide) }, // "/"
      { ALT: () => $.CONSUME(Modulus) }, // "%"
      { ALT: () => $.CONSUME(NullishCoalescingToken) }, // "??"
      { ALT: () => $.CONSUME(AndTestToken) }, // "&&"
      { ALT: () => $.CONSUME(OrTestToken) }, // "||"
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonEqualToken), // "="
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonInToken), // "in"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotBetweenToken), // "not between"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotContainsToken), // "not contains"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotILikeToken), // "not ilike"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotIncludesToken), // "not includes"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotInToken), // "not in"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonBetweenToken), // "between"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonContainsToken), // "@>"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonContainsStringToken), // "contains"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonILikeToken), // "ilike"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonIncludesToken), // "includes"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonLikeToken), // "like"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotLikeToken), // "not like"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotOverlapsToken), // "not overlaps"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonNotRegexToken), // "!~"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonOverlapsToken), // "overlaps"
      },
      {
        GATE: () => options.allowQueryExpression,
        ALT: () => $.CONSUME(JsonSearchToken), // "search"
      },
      {
        // the regex operator is also the concatenation operator so
        // it is always allowed
        ALT: () => $.CONSUME(JsonRegexToken), // "~"
      },
    ]);

    $.OPTION({
      GATE: () =>
        options.allowQueryExpression &&
        OperatorAcceptingOptionalIfNull.includes(operator.tokenType),
      DEF: () => $.CONSUME1(Question), // "?"
    });

    $.SUBRULE($.expressionFn, { ARGS: [token, options] });
  };
}

export function simpleExpressionFn($) {
  return () => {
    $.OR([
      // Group 1: Literals (fast path - most common, distinct tokens)
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(SingleQuotedStringLiteral) },
      { ALT: () => $.CONSUME(IntegerLiteral) },
      { ALT: () => $.CONSUME(FloatLiteral) },
      { ALT: () => $.CONSUME(TrueToken) },
      { ALT: () => $.CONSUME(FalseToken) },
      { ALT: () => $.CONSUME(NullToken) },
      { ALT: () => $.CONSUME(NowToken) },

      // Group 2: Complex literals (distinct tokens)
      { ALT: () => $.CONSUME(MultiLineStringToken) },
      { ALT: () => $.CONSUME(MultiLineExpressionToken) },
      { ALT: () => $.CONSUME(ExpressionLiteral) },

      { ALT: () => $.SUBRULE($.longFormVariable) },
      { ALT: () => $.SUBRULE($.completeAuthVariable) },
      { ALT: () => $.SUBRULE($.completeEnvVariable) },
      { ALT: () => $.SUBRULE($.completeInputVariable) },
      { ALT: () => $.SUBRULE($.completeErrorVariable) }, // e.g., $error.code
      { ALT: () => $.SUBRULE($.shortFormVariable) },

      // Group 4: Structured values (distinct starting tokens)
      { ALT: () => $.SUBRULE($.castedValue) },
    ]);
  };
}
