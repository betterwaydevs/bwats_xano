import { CreateRsaKeyToken } from "../../../lexer/security.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function securityCreateRsaKeyFn($) {
  const requiredAttrs = ["bits", "format"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("securityCreateRsaKeyFn");
    const fnToken = $.CONSUME(CreateRsaKeyToken); // "create_rsa_key"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
