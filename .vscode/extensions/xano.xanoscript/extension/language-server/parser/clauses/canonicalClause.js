import { CanonicalToken } from "../../lexer/columns.js";
import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const canonicalClause = ($) => () => {
  $.sectionStack.push("canonicalClause");

  const parent = $.CONSUME(CanonicalToken); // canonical
  $.CONSUME(EqualToken); // =

  const result = $.CONSUME(StringLiteral); // "alsdkfjlskdjf"

  // Don't allow empty values inside quotes
  if (result.image === `""`) {
    $.addMissingError(parent, "canonical cannot be empty");
  }

  $.sectionStack.pop();
};
