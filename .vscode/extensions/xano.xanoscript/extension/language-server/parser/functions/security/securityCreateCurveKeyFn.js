import { CreateCurveKeyToken } from "../../../lexer/security.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function securityCreateCurveKeyFn($) {
  const requiredAttrs = ["curve", "format"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("securityCreateCurveKeyFn");
    const fnToken = $.CONSUME(CreateCurveKeyToken); // "create_curve_key"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
