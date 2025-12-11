import { CommaToken, LSquare, RSquare } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * ["active", "inactive"]
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const stringArray = ($) => () => {
  let hasSeparator = true; // allow a trailing comma
  let token = $.CONSUME(LSquare); // "["
  $.MANY(() => $.CONSUME(NewlineToken)); // allow new lines after the opening bracket
  $.MANY1(() => {
    if (!hasSeparator) {
      $.addMissingError(
        token,
        "Missing comma or newline between string values in the array"
      );
    }
    token = $.CONSUME(StringLiteral);
    hasSeparator = false;
    $.OPTION(() => {
      $.CONSUME(CommaToken);
      hasSeparator = true;
    }); // ","
    $.MANY2(() => {
      $.CONSUME1(NewlineToken);
      hasSeparator = true;
    }); // "\n"
  });
  $.CONSUME(RSquare); // "]"
};
