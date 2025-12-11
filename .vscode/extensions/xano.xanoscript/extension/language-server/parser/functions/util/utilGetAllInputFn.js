import { GetAllInputToken } from "../../../lexer/util.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilGetAllInputFn($) {
  const requiredAttrs = [];
  const optionalAttrs = ["description", "disabled"];

  // util.get_all_input as $x3
  return () => {
    $.sectionStack.push("utilGetAllInputFn");
    const fnToken = $.CONSUME(GetAllInputToken); // "get_all_input"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
