import { SignPrivateUrlToken } from "../../../lexer/storage.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function storageSignPrivateUrlFn($) {
  return () => {
    const requiredAttrs = ["pathname", "ttl"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("storageSignPrivateUrlFn");
    const fnToken = $.CONSUME(SignPrivateUrlToken); // "sign_private_url"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
