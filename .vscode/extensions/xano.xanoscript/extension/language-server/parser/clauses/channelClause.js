import { ChannelToken } from "../../lexer/columns.js";
import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const channelClause = ($) => () => {
  $.sectionStack.push("channelClause");

  const parent = $.CONSUME(ChannelToken); // channel
  $.CONSUME(EqualToken); // =

  const result = $.CONSUME(StringLiteral); // "channel_name"

  // Don't allow empty values inside quotes
  if (result.image === `""`) {
    $.addMissingError(parent, "channel cannot be empty");
  }

  $.sectionStack.pop();
};
