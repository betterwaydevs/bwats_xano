import { ShortFormVariable } from "../../lexer/variables.js";

/**
 * matches the short form variable definition like:
 * $x
 * $x.y.z
 * $x[1].y
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function shortFormVariable($) {
  return () => {
    $.CONSUME(ShortFormVariable);
    $.SUBRULE($.chainedIdentifier);
  };
}
