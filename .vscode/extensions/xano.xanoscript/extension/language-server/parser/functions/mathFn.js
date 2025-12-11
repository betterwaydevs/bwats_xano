import { MathToken } from "../../lexer/math.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function mathFn($) {
  return () => {
    $.sectionStack.push("math");
    $.CONSUME(MathToken); // "math"
    $.CONSUME(DotToken); // "."
    $.SUBRULE($.allMathFn);
    $.sectionStack.pop();
  };
}
