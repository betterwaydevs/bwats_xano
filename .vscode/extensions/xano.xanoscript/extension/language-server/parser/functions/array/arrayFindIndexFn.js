import { FindIndexToken } from "../../../lexer/arrays.js";

// array.find_index (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayFindIndexFn($) {
  return () => {
    $.sectionStack.push("arrayFindIndexFn");
    const parent = $.CONSUME(FindIndexToken); // "find_index"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
