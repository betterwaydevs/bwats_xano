import { DotToken, Identifier } from "../../lexer/tokens.js";
import { LongFormVariable,ShortFormVariable } from "../../lexer/variables.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function assignableVariableAs($) {
  return () => {
    $.OR([
      // "$users"
      {
        ALT: () => {
          $.CONSUME(ShortFormVariable);
        },
      },
      // "$var.users"
      {
        ALT: () => {
          $.CONSUME(LongFormVariable);
          $.CONSUME(DotToken);
          $.CONSUME(Identifier);
        },
      },
    ]);
  };
}
