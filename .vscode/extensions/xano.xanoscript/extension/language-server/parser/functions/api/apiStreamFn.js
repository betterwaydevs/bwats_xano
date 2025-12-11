import { StreamToken } from "../../../lexer/api.js";

// api.stream {
//   value = $data
// }

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function apiStreamFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("apiStreamFn");
    const fnToken = $.CONSUME(StreamToken); // "stream"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
