import { ActiveToken } from "../lexer/api_group.js";
import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import { DataSourceToken, TaskToken } from "../lexer/task.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";

export function taskDeclaration($) {
  return () => {
    let hasActive = false;
    let hasDataSource = false;
    let hasDescription = false;
    let hasDocs = false;
    let hasHistory = false;
    let hasMiddleware = false;
    let hasSchedule = false;
    let hasStack = false;
    let hasTags = false;

    const testNames = [];

    $.sectionStack.push("taskDeclaration");
    // Allow leading comments and newlines before the task declaration
    $.SUBRULE($.optionalCommentBlockFn);

    $.CONSUME(TaskToken);
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      $.OR2([
        { ALT: () => $.SUBRULE($.commentBlockFn) },
        {
          GATE: () => !hasActive,
          ALT: () => {
            hasActive = true;
            $.CONSUME(ActiveToken);
            $.CONSUME(EqualToken);
            $.SUBRULE($.booleanValue);
          },
        },
        {
          GATE: () => !hasDataSource,
          ALT: () => {
            hasDataSource = true;
            $.CONSUME(DataSourceToken);
            $.CONSUME2(EqualToken);
            $.CONSUME2(StringLiteral);
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
          GATE: () => !hasMiddleware,
          ALT: () => {
            hasMiddleware = true;
            $.SUBRULE($.middlewareClause);
          },
        },
        {
          GATE: () => !hasSchedule,
          ALT: () => {
            hasSchedule = true;
            $.SUBRULE($.scheduleClause);
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

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
