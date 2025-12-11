import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";
import { DatasourceToken, WorkflowTestToken } from "../lexer/workflow_test.js";

export function workflowTestDeclaration($) {
  return () => {
    let hasDatasource = false;
    let hasDescription = false;
    let hasStack = false;
    let hasTags = false;

    $.sectionStack.push("workflowTestDeclaration");
    // Allow leading comments and newlines before the workflow_test declaration
    $.SUBRULE($.optionalCommentBlockFn);

    const parent = $.CONSUME(WorkflowTestToken);
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
          GATE: () => !hasDatasource,
          ALT: () => {
            hasDatasource = true;
            $.CONSUME(DatasourceToken);
            $.CONSUME(EqualToken);
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
          GATE: () => !hasStack,
          ALT: () => {
            hasStack = true;
            $.SUBRULE($.stackClause, {
              ARGS: [
                { allowExpectStatements: true, allowCallStatements: true },
              ],
            });
          },
        },
        {
          GATE: () => !hasTags,
          ALT: () => {
            hasTags = true;
            $.SUBRULE($.tagsAttribute);
          },
        },
      ]);
    });

    if (!hasStack) {
      $.addMissingError(parent, "{} is missing a stack clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
