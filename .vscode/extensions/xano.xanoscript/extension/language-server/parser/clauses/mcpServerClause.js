import { McpServerToken } from "../../lexer/columns.js";
import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const mcpServerClause = ($) => () => {
  $.sectionStack.push("mcpServerClause");

  const parent = $.CONSUME(McpServerToken); // mcp_server
  $.CONSUME(EqualToken); // =

  const result = $.CONSUME(StringLiteral); // "mcpserver_name"

  // Don't allow empty values inside quotes
  if (result.image === `""`) {
    $.addMissingError(parent, "mcp_server cannot be empty");
  }

  $.sectionStack.pop();
};
