import { RealtimeEventToken } from "../../../lexer/api.js";

// api.realtime_event {
//   channel = $env.$http_headers
//   data = $env.$http_headers
//   auth_table = "37"
//   auth_id = $env.my_var
// }

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function apiRealtimeEventFn($) {
  const requiredAttrs = ["channel", "data", "auth_table", "auth_id"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("apiRealtimeEventFn");
    const fnToken = $.CONSUME(RealtimeEventToken); // "realtime_event"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
