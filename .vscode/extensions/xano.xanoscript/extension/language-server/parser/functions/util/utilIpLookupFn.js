import { IpLookupToken } from "../../../lexer/util.js";

/**
 * util.ip_lookup {
 *   value = ""
 * } as x6
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilIpLookupFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilIpLookupFn");
    const fnToken = $.CONSUME(IpLookupToken); // "ip_lookup"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
