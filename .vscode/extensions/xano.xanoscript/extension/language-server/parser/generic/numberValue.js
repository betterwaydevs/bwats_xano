import { FloatLiteral, IntegerLiteral } from "../../lexer/literal.js";

/**
 * A number value can be either an integer or a float.
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function numberValue($) {
  return () => {
    $.OR(
      [
        {
          ALT: () => {
            $.CONSUME(IntegerLiteral, { ERR_MSG: "Integer literal expected" });
          },
        },
        {
          ALT: () => {
            $.CONSUME(FloatLiteral, { ERR_MSG: "Float literal expected" });
          },
        },
      ],
      {
        ERR_MSG: "Number literal expected",
      }
    );
  };
}
