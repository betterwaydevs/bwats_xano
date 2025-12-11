import { LParent, RParent } from "../../../lexer/control.js";
import { PreconditionToken } from "../../../lexer/util.js";

/**
 * precondition {
 *   error_type = "standard"
 *   error = "Something went wrong"
 * } as x6
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function preconditionFn($) {
  return () => {
    const requiredAttrs = [];
    const optionalAttrs = [
      "description",
      "disabled",
      "error_type",
      "error",
      "payload",
    ];

    $.sectionStack.push("preconditionFn");
    const tokenFn = $.CONSUME(PreconditionToken); // "precondition"
    $.CONSUME(LParent);
    $.SUBRULE($.expressionFn);
    $.CONSUME(RParent);
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
