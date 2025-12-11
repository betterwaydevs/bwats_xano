import { AuthVariable } from "../../lexer/variables.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function completeAuthVariable($) {
  return () => {
    $.CONSUME(AuthVariable);
    $.SUBRULE($.chainedIdentifier);
  };
}
