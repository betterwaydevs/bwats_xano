import { AwaitToken } from "../../../lexer/control.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function awaitFn($) {
  const requiredAttrs = ["ids", "timeout"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("awaitFn");
    const fnToken = $.CONSUME(AwaitToken); // "await"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
