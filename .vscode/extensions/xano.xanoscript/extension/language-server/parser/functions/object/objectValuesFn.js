import { ValuesToken } from "../../../lexer/object.js";

/**
 * object.values {
 *   value = $my_obj
 * } as $values
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function objectValuesFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("objectValuesFn");
    const fnToken = $.CONSUME(ValuesToken); // "values"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
