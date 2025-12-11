import { DebugStopToken } from "../../../lexer/debug.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function debugStopFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("debugStop");
    const tokenFn = $.CONSUME(DebugStopToken); // stop
    // value is a required field
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });

    $.sectionStack.pop();
  };
}
