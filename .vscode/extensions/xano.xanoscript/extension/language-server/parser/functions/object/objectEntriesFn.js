import { EntriesToken } from "../../../lexer/object.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function objectEntriesFn($) {
  // object.entries {
  //   value = $my_obj
  // } as $entries
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("objectEntriesFn");
    const fnToken = $.CONSUME(EntriesToken); // "entries"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
