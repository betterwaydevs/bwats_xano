import { KeysToken } from "../../../lexer/object.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function objectKeysFn($) {
  // object.keys {
  //   value = $my_obj
  // } as $keys
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("objectKeysFn");
    const fnToken = $.CONSUME(KeysToken); // "keys"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
