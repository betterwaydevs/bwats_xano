import { allTextWithoutReturnValueFn } from "./allTextWithoutReturnValueFn.js";
import { allTextWithReturnValueFn } from "./allTextWithReturnValueFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.allTextWithoutReturnValueFn = $.RULE(
    "allTextWithoutReturnValueFn",
    allTextWithoutReturnValueFn($)
  );
  $.allTextWithReturnValueFn = $.RULE(
    "allTextWithReturnValueFn",
    allTextWithReturnValueFn($)
  );
};
