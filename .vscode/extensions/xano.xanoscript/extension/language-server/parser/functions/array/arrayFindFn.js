import { FindToken } from "../../../lexer/arrays.js";

// array.find (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayFindFn($) {
  return () => {
    $.sectionStack.push("arrayFindFn");
    const parent = $.CONSUME(FindToken); // "find"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
