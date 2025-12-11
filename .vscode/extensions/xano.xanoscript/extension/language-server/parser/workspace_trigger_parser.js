import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";
import {
  ActionsToken,
  ActiveToken,
  WorkspaceTriggerToken,
} from "../lexer/workspace_trigger.js";

export function workspaceTriggerDeclaration($) {
  return () => {
    let hasActions = false;
    let hasActive = false;
    let hasDescription = false;
    let hasHistory = false;
    let hasInput = false;
    let hasStack = false;
    let hasTags = false;

    $.sectionStack.push("workspaceTriggerDeclaration");
    // Allow leading comments and newlines before the workspace_trigger declaration
    $.SUBRULE($.optionalCommentBlockFn);

    const parent = $.CONSUME(WorkspaceTriggerToken); // workspace_trigger
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
          GATE: () => !hasActions,
          ALT: () => {
            hasActions = true;

            const subParent = $.CONSUME(ActionsToken); // "actions"
            $.CONSUME(EqualToken); // "="

            $.SUBRULE($.objectAttrReq, {
              ARGS: [
                subParent,
                [], // required
                ["branch_live", "branch_merge", "branch_new"], // optional
                {
                  types: {
                    branch_live: "boolean",
                    branch_merge: "boolean",
                    branch_new: "boolean",
                  },
                },
              ],
            });
          },
        },
        {
          GATE: () => !hasActive,
          ALT: () => {
            hasActive = true;
            $.CONSUME(ActiveToken);
            $.CONSUME2(EqualToken);
            $.SUBRULE($.booleanValue);
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
      ]);
    });

    if (!hasInput) {
      $.addMissingError(parent, "{} is missing an input clause");
    }

    if (!hasStack) {
      $.addMissingError(parent, "{} is missing a stack clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
