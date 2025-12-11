import { FalseToken, TrueToken } from "../../lexer/tokens.js";

/**
 * A boolean value parser that matches either `true` or `false`.
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function booleanValue($) {
  return () => {
    $.OR([
      {
        ALT: () => {
          $.CONSUME(TrueToken);
        },
      },
      {
        ALT: () => {
          $.CONSUME(FalseToken);
        },
      },
    ]);
  };
}
