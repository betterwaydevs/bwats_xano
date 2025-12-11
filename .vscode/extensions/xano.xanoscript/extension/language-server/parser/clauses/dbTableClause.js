import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { TableToken } from "../../lexer/table.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const dbTableClause = ($) => () => {
  $.sectionStack.push("dbTableClause");

  const parent = $.CONSUME(TableToken); // table
  $.CONSUME(EqualToken); // =

  const result = $.CONSUME(StringLiteral); // "tablename"

  // Don't allow empty values inside quotes
  if (result.image === `""`) {
    $.addMissingError(parent, "table cannot be empty");
  }

  $.sectionStack.pop();
};
