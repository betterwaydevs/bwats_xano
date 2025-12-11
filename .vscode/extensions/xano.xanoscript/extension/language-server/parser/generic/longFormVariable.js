import { LSquare, RSquare } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";
import { LongFormVariable } from "../../lexer/variables.js";

/**
 * matches the long form variable definition like
 * $var.x
 * $var.x.y.z
 * $var.x[1].y
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function longFormVariable($) {
  return () => {
    $.CONSUME(LongFormVariable);
    $.OR([
      {
        ALT: () => {
          $.CONSUME(DotToken);
          $.OR1([
            {
              ALT: () => $.CONSUME(Identifier),
            },
            {
              ALT: () => {
                $.CONSUME(LSquare);
                $.CONSUME(StringLiteral);
                $.CONSUME(RSquare);
              },
            },
          ]);
        },
      },
      {
        ALT: () => {
          $.CONSUME2(LSquare);
          $.CONSUME2(StringLiteral);
          $.CONSUME2(RSquare);
        },
      },
    ]);
    $.SUBRULE($.chainedIdentifier);
  };
}
