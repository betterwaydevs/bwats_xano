import { FilterCountToken } from "../../../lexer/arrays.js";

// array.filter_count (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayFilterCountFn($) {
  return () => {
    $.sectionStack.push("arrayFilterCountFn");
    const parent = $.CONSUME(FilterCountToken); // "filter_count"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
