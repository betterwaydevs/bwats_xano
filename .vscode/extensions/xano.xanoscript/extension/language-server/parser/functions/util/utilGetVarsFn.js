import { GetVarsToken } from "../../../lexer/util.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilGetVarsFn($) {
  // util.get_vars as $x3
  return () => {
    const requiredAttrs = [];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilGetVarsFn");
    const fnToken = $.CONSUME(GetVarsToken); // "get_vars"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
