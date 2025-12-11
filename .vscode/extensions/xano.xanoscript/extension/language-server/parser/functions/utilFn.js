import { DotToken } from "../../lexer/tokens.js";
import { UtilToken } from "../../lexer/util.js";

/**
 * util.geo_distance
 * util.get_all_input
 * util.get_env
 * util.get_raw_input
 * util.get_vars
 * util.ip_lookup
 * util.post_process
 * util.precondition
 * util.set_header
 * util.sleep
 * util.template
 * util.send_email
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function utilFn($) {
  return () => {
    $.sectionStack.push("util");
    $.CONSUME(UtilToken); // "util"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.utilIpLookupFn) }, // "util.ip_lookup"
      { ALT: () => $.SUBRULE($.utilGetEnvFn) }, // "util.get_env"
      { ALT: () => $.SUBRULE($.utilSleepFn) }, // "util.sleep"
      { ALT: () => $.SUBRULE($.utilGetAllInputFn) }, // "util.get_all_input"
      { ALT: () => $.SUBRULE($.utilGetRawInputFn) }, // "util.get_raw_input"
      { ALT: () => $.SUBRULE($.utilGetVarsFn) }, // "util.get_vars"
      { ALT: () => $.SUBRULE($.utilGeoDistanceFn) }, // "util.geo_distance"
      { ALT: () => $.SUBRULE($.utilPostProcessFn) }, // "util.post_process"
      { ALT: () => $.SUBRULE($.utilSetHeaderFn) }, // "util.set_header"
      { ALT: () => $.SUBRULE($.utilTemplateFn) }, // "util.template"
      { ALT: () => $.SUBRULE($.utilSendEmailFn) }, // "util.send_email"
    ]);
    $.sectionStack.pop();
  };
}
