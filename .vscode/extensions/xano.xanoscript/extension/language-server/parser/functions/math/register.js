import { allMathFn } from "./allMathFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.allMathFn = $.RULE("allMathFn", allMathFn($));
};
