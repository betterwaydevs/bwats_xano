import { ThrowToken } from "../../../lexer/control.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function throwFn($) {
  const requiredAttrs = ["value", "name"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("throw");
    const tokenFn = $.CONSUME(ThrowToken); // "throw"
    // value is a required field
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });

    $.sectionStack.pop();
  };
}
