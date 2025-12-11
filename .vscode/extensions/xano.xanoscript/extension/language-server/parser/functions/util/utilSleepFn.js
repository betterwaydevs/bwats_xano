import { SleepToken } from "../../../lexer/util.js";

/**
 * util.sleep" as $x3
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilSleepFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilSleepFn");
    const tokenFn = $.CONSUME(SleepToken); // "sleep"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [tokenFn, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
