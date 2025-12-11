import { CreatePasswordToken } from "../../../lexer/security.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function securityCreatePasswordFn($) {
  const requiredAttrs = [
    "character_count",
    "require_lowercase",
    "require_uppercase",
    "require_digit",
    "require_symbol",
    "symbol_whitelist",
  ];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("securityCreatePasswordFn");
    const fnToken = $.CONSUME(CreatePasswordToken); // "create_password"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
