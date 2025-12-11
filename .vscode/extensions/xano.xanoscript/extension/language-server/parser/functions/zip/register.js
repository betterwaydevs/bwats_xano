import { zipAddToArchiveFn } from "./zipAddToArchiveFn.js";
import { zipCreateArchiveFn } from "./zipCreateArchiveFn.js";
import { zipDeleteFromArchiveFn } from "./zipDeleteFromArchiveFn.js";
import { zipExtractFn } from "./zipExtractFn.js";
import { zipViewContentsFn } from "./zipViewContentsFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.zipAddToArchiveFn = $.RULE("zipAddToArchiveFn", zipAddToArchiveFn($));
  $.zipCreateArchiveFn = $.RULE("zipCreateArchiveFn", zipCreateArchiveFn($));
  $.zipDeleteFromArchiveFn = $.RULE(
    "zipDeleteFromArchiveFn",
    zipDeleteFromArchiveFn($)
  );
  $.zipExtractFn = $.RULE("zipExtractFn", zipExtractFn($));
  $.zipViewContentsFn = $.RULE("zipViewContentsFn", zipViewContentsFn($));
};
