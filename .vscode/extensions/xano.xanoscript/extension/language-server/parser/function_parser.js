import { CommentToken } from "../lexer/comment.js";
import { LCurly, RCurly } from "../lexer/control.js";
import { FunctionToken } from "../lexer/function.js";
import { StringLiteral } from "../lexer/literal.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";

export function functionDeclaration($) {
  return () => {
    let hasCache = false;
    let hasDescription = false;
    let hasDocs = false;
    let hasHistory = false;
    let hasInput = false;
    let hasMiddleware = false;
    let hasResponse = false;
    let hasStack = false;
    let hasTags = false;

    const testNames = [];

    $.sectionStack.push("functionDeclaration");
    // Allow leading comments and newlines before the function declaration
    $.SUBRULE($.optionalCommentBlockFn);
    const parent = $.CONSUME(FunctionToken);
    $.OR([
      { ALT: () => $.CONSUME(Identifier) },
      { ALT: () => $.CONSUME(StringLiteral) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      $.OR2([
        { ALT: () => $.CONSUME(CommentToken) },
        {
          GATE: () => !hasCache,
          ALT: () => {
            hasCache = true;
            $.SUBRULE($.cacheClause);
          },
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
          GATE: () => !hasMiddleware,
          ALT: () => {
            hasMiddleware = true;
            $.SUBRULE($.middlewareClause);
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
