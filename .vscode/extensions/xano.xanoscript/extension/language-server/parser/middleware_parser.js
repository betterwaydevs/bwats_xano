import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import {
  ExceptionPolicyToken,
  MiddlewareToken,
  ResponseStrategyToken,
} from "../lexer/middleware.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";

export function middlewareDeclaration($) {
  return () => {
    let hasDescription = false;
    let hasDocs = false;
    let hasExceptionPolicy = false;
    let hasHistory = false;
    let hasInput = false;
    let hasResponse = false;
    let hasResponseStrategy = false;
    let hasStack = false;
    let hasTags = false;

    const testNames = [];

    $.sectionStack.push("middlewareDeclaration");
    // Allow leading comments and newlines before the middleware declaration
    $.SUBRULE($.optionalCommentBlockFn);

    const parent = $.CONSUME(MiddlewareToken);
    $.OR([
      { ALT: () => $.CONSUME(Identifier) },
      { ALT: () => $.CONSUME(StringLiteral) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      $.OR2([
        {
          ALT: () => $.SUBRULE($.commentBlockFn),
        },
        {
          GATE: () => !hasDescription,
          ALT: () => {
            hasDescription = true;
            $.SUBRULE($.descriptionFieldAttribute);
          },
        },
        {
          GATE: () => !hasDocs,
          ALT: () => {
            hasDocs = true;
            $.SUBRULE($.docsFieldAttribute);
          },
        },
        {
          GATE: () => !hasExceptionPolicy,
          ALT: () => {
            hasExceptionPolicy = true;

            $.CONSUME(ExceptionPolicyToken);
            $.CONSUME(EqualToken);
            $.SUBRULE($.enumValue, {
              ARGS: ["silent", "rethrow", "critical"],
            });
          },
        },
        {
          GATE: () => !hasHistory,
          ALT: () => {
            hasHistory = true;
            $.SUBRULE($.historyClause);
          },
        },
        {
          GATE: () => !hasInput,
          ALT: () => {
            hasInput = true;
            $.SUBRULE($.inputClause);
          },
        },
        {
          GATE: () => !hasResponse,
          ALT: () => {
            hasResponse = true;
            $.SUBRULE($.responseClause);
          },
        },
        {
          GATE: () => !hasResponseStrategy,
          ALT: () => {
            hasResponseStrategy = true;

            $.CONSUME(ResponseStrategyToken);
            $.CONSUME2(EqualToken);
            $.SUBRULE2($.enumValue, { ARGS: ["merge", "replace"] });
          },
        },
        {
          GATE: () => !hasStack,
          ALT: () => {
            hasStack = true;
            $.SUBRULE($.stackClause);
          },
        },
        {
          GATE: () => !hasTags,
          ALT: () => {
            hasTags = true;
            $.SUBRULE($.tagsAttribute);
          },
        },
        {
          // no GATE here, you can have multiple test clauses
          ALT: () => {
            $.SUBRULE($.testClause, { ARGS: [testNames] });
          },
        },
      ]);
    });

    if (!hasInput) {
      $.addMissingError(parent, "{} is missing an input clause");
    }

    if (!hasStack) {
      $.addMissingError(parent, "{} is missing a stack clause");
    }

    if (!hasResponse) {
      $.addMissingError(parent, "{} is missing a response clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
