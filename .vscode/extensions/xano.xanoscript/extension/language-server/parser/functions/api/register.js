import { apiCallFn } from "./apiCallFn.js";
import { apiLambdaFn } from "./apiLambdaFn.js";
import { apiRealtimeEventFn } from "./apiRealtimeEventFn.js";
import { apiRequestFn } from "./apiRequestFn.js";
import { apiStreamFn } from "./apiStreamFn.js";
import { webflowRequestFn } from "./webflowRequestFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.apiLambdaFn = $.RULE("apiLambdaFn", apiLambdaFn($));
  $.apiRealtimeEventFn = $.RULE("apiRealtimeEventFn", apiRealtimeEventFn($));
  $.apiRequestFn = $.RULE("apiRequestFn", apiRequestFn($));
  $.apiStreamFn = $.RULE("apiStreamFn", apiStreamFn($));
  $.apiCallFn = $.RULE("apiCallFn", apiCallFn($));
  $.webflowRequestFn = $.RULE("webflowRequestFn", webflowRequestFn($));
};
