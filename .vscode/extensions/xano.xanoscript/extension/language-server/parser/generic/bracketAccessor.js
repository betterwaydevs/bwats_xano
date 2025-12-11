import { LSquare, RSquare } from "../../lexer/control.js";
import { IntegerLiteral } from "../../lexer/literal.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * to be used after a variable to reference their properties
 * like foo.bar.x[1].y[2].z
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function bracketAccessor($) {
  return () => {
    $.CONSUME(LSquare);
    $.SUBRULE($.expressionFn);
    $.CONSUME(RSquare);
  };
}

/**
 * Slightly adjusted bracket accessor for array accessors only
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function bracketArrayAccessor($) {
  return () => {
    $.OR([
      {
        ALT: () => {
          $.CONSUME(LSquare);
          $.SUBRULE($.expressionFn);
          $.CONSUME(RSquare);
        },
      },
      {
        ALT: () => {
          $.CONSUME(DotToken);
          $.OR1([
            {
              ALT: () => $.CONSUME(IntegerLiteral),
            },
            {
              ALT: () => {
                $.CONSUME1(LSquare);
                $.SUBRULE1($.expressionFn);
                $.CONSUME1(RSquare);
              },
            },
          ]);
        },
      },
    ]);
  };
}
