import { HasToken } from "../../../lexer/arrays.js";

// array.has (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayHasFn($) {
  return () => {
    $.sectionStack.push("arrayHasFn");
    const parent = $.CONSUME(HasToken); // "has"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
