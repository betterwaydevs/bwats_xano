import { CommaToken, LSquare, RSquare } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function arrayWithValues($) {
  return (options = {}) => {
    let need_separators = false;
    const parent = $.CONSUME(LSquare); // "["
    $.MANY(() => {
      $.MANY1(() => {
        need_separators = false;
        $.CONSUME(NewlineToken);
      });
      if (need_separators) {
        $.addMissingError(CommaToken, "Expected ',' between array values");
      }
      $.SUBRULE($.expressionFn, {
        ARGS: [parent, { ...options, allowObject: true, allowArray: true }],
      });
      need_separators = true;
      $.OPTION1(() => {
        need_separators = false;
        $.CONSUME1(CommaToken);
      });
      $.MANY2(() => {
        need_separators = false;
        $.CONSUME1(NewlineToken);
      });
    });

    $.CONSUME(RSquare); // "]"
  };
}
