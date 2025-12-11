import { ApiToken } from "../../lexer/api.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function apiFn($) {
  return (options = {}) => {
    $.sectionStack.push("api");
    $.CONSUME(ApiToken); // "api"
    $.CONSUME(DotToken); // "."
    $.OR([
      {
        GATE: () => options.allowCallStatements,
        ALT: () => $.SUBRULE($.apiCallFn), // "api.call"
      },
      { ALT: () => $.SUBRULE($.apiLambdaFn) }, // "api.lambda"
      { ALT: () => $.SUBRULE($.apiRequestFn) }, // "api.request"
      { ALT: () => $.SUBRULE($.apiRealtimeEventFn) }, // "api.realtime_event"
      { ALT: () => $.SUBRULE($.apiStreamFn) }, // "api.stream"
    ]);
    $.sectionStack.pop();
  };
}
