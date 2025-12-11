import { ReturnToken } from "../../../lexer/control.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function returnFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("return");
    const tokenFn = $.CONSUME(ReturnToken); // "return"
    // value is a required field
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });

    $.sectionStack.pop();
  };
}
