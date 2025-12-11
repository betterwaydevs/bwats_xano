import { streamFromCsvFn } from "./streamFromCsvFn.js";
import { streamFromJsonlFn } from "./streamFromJsonlFn.js";
import { streamFromRequestFn } from "./streamFromRequestFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.streamFromCsvFn = $.RULE("streamFromCsvFn", streamFromCsvFn($));
  $.streamFromJsonlFn = $.RULE("streamFromJsonlFn", streamFromJsonlFn($));
  $.streamFromRequestFn = $.RULE("streamFromRequestFn", streamFromRequestFn($));
};
