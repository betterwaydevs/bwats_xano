import { EqualToken, LCurly, RCurly } from "../lexer/control.js";
import { StringLiteral } from "../lexer/literal.js";
import {
  ActiveToken,
  InstructionsToken,
  McpServerToken,
  ToolsToken,
} from "../lexer/mcp_server.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";

export function mcpServerDeclaration($) {
  return () => {
    let hasActive = false;
    let hasCanonical = false;
    let hasDescription = false;
    let hasDocs = false;
    let hasHistory = false;
    let hasInstructions = false;
    let hasTags = false;
    let hasTools = false;

    $.sectionStack.push("mcpServerDeclaration");
    // Allow leading comments and newlines before the mcp_server declaration
    $.SUBRULE($.optionalCommentBlockFn);
    const parent = $.CONSUME(McpServerToken); // mcp_server
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      $.OR2([
        {
          ALT: () => $.SUBRULE($.commentBlockFn),
        },
        {
          GATE: () => !hasActive,
          ALT: () => {
            hasActive = true;

            $.CONSUME(ActiveToken); // "active"
            $.CONSUME(EqualToken); // "="
            $.SUBRULE($.booleanValue); // true/false
          },
        },
        {
          GATE: () => !hasCanonical,
          ALT: () => {
            hasCanonical = true;
            $.SUBRULE($.canonicalClause);
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
          GATE: () => !hasInstructions,
          ALT: () => {
            hasInstructions = true;

            // instructions = {string or multiline string}
            $.SUBRULE1($.flexibleStringClause, {
              ARGS: [InstructionsToken],
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
        {
          GATE: () => !hasTools,
          ALT: () => {
            hasTools = true;

            const subParent = $.CONSUME(ToolsToken); // "tools"
            $.CONSUME2(EqualToken); // "="

            // [{"name":"tool_name"}]
            $.SUBRULE($.arrayOfObjectAttrReq, {
              ARGS: [
                subParent,
                ["name"], // required
                ["active", "auth"], // optional
                {
                  types: {
                    active: "boolean",
                    auth: "string",
                    name: "string",
                  },
                },
              ],
            });
          },
        },
      ]);
    });

    if (!hasTools) {
      $.addMissingError(parent, "{} is missing tools clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
