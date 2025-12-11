import { CommaToken, LSquare, RSquare } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * Dynamicly raises error for missing and required attributes
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function arrayOfStringLiterals($) {
  return () => {
    $.CONSUME(LSquare); // "["
    $.OPTION(() => {
      $.OR([
        // multi line, each value on a new line
        // [
        //   value
        //   value2
        // ]
        {
          ALT: () => {
            $.CONSUME(NewlineToken);
            $.AT_LEAST_ONE(() => {
              $.CONSUME(StringLiteral);
              $.OPTION1(() => $.CONSUME(CommaToken)); // optional comma
              $.AT_LEAST_ONE1(() => $.CONSUME3(NewlineToken));
            });
          },
        },
        // one line, comma separated [ value, value2 ]
        {
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              SEP: CommaToken,
              DEF: () => {
                $.CONSUME1(StringLiteral);
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
