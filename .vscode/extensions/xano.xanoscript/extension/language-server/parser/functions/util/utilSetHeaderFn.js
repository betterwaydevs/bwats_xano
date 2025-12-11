import { SetHeaderToken } from "../../../lexer/util.js";

/**
 * util.set_header {
 *   value: "Set-Cookie: sessionId=e8bb43229de9; HttpOnly; Server; Domain=foo.example.com"
 *   duplicate: "duplicate"
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilSetHeaderFn($) {
  return () => {
    const requiredAttrs = ["value", "duplicates"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilSetHeaderFn");
    const tokenFn = $.CONSUME(SetHeaderToken); // "set_header"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
