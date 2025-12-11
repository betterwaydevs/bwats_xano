import { AgentToken } from "../../lexer/columns.js";
import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const agentClause = ($) => () => {
  $.sectionStack.push("agentClause");

  const parent = $.CONSUME(AgentToken); // agent
  $.CONSUME(EqualToken); // =

  const result = $.CONSUME(StringLiteral); // "agentname"

  // Don't allow empty values inside quotes
  if (result.image === `""`) {
    $.addMissingError(parent, "agent cannot be empty");
  }

  $.sectionStack.pop();
};
