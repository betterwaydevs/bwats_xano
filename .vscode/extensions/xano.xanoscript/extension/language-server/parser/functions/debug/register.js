import { debugLogFn } from "./debugLogFn.js";
import { debugStopFn } from "./debugStopFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.debugLogFn = $.RULE("debugLogFn", debugLogFn($));
  $.debugStopFn = $.RULE("debugStopFn", debugStopFn($));
};
