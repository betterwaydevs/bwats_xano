import { objectEntriesFn } from "./objectEntriesFn.js";
import { objectKeysFn } from "./objectKeysFn.js";
import { objectValuesFn } from "./objectValuesFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.objectEntriesFn = $.RULE("objectEntriesFn", objectEntriesFn($));
  $.objectKeysFn = $.RULE("objectKeysFn", objectKeysFn($));
  $.objectValuesFn = $.RULE("objectValuesFn", objectValuesFn($));
};
