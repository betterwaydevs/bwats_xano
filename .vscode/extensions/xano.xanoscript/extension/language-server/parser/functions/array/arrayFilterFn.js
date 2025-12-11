import { FilterToken } from "../../../lexer/arrays.js";

// array.filter (`[]|array_push:1|array_push:2|array_push:3`) if (`$this == 1`) as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayFilterFn($) {
  return () => {
    $.sectionStack.push("arrayFilterFn");
    const parent = $.CONSUME(FilterToken); // "filter"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
