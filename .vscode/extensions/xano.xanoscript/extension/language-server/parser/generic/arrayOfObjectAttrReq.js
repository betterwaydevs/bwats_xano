import { CommaToken, LSquare, RSquare } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * see objectAttrReq signature for arrayOfObjectAttrReq arguments details
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function arrayOfObjectAttrReq($) {
  /**
   * @param {import('chevrotain').Rule} rule
   **/
  return (parent, required, optional, options = {}) => {
    $.CONSUME(LSquare); // "["
    $.OPTION(() => {
      $.OR([
        // multi line, each value on a new line
        {
          ALT: () => {
            $.CONSUME(NewlineToken);
            $.AT_LEAST_ONE(() => {
              $.SUBRULE($.objectAttrReq, {
                ARGS: [parent, required, optional, options],
              });
              $.OPTION1(() => $.CONSUME(CommaToken)); // optional comma
              $.AT_LEAST_ONE1(() => $.CONSUME3(NewlineToken));
            });
          },
        },
        // one line, comma separated [ ..., ... ]
        {
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              SEP: CommaToken,
              DEF: () => {
                $.SUBRULE1($.objectAttrReq, {
                  ARGS: [parent, required, optional, options],
                });
              },
            });
            $.MANY(() => $.CONSUME2(NewlineToken));
          },
        },
      ]);
    });
    $.CONSUME(RSquare); // "]"
  };
}
