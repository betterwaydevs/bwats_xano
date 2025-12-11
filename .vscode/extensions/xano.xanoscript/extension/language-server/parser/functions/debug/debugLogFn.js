import { DebugLogToken } from "../../../lexer/debug.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function debugLogFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("debugLog");
    const tokenFn = $.CONSUME(DebugLogToken); // log
    // value is a required field
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });

    $.sectionStack.pop();
  };
}
