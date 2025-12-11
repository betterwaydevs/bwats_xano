import { LSquare, RSquare } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";
import { InputVariable } from "../../lexer/variables.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function completeInputVariable($) {
  return () => {
    $.CONSUME(InputVariable);
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
