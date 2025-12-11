import { ArrayToken } from "../../lexer/arrays.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function arrayFn($) {
  return () => {
    $.sectionStack.push("array");
    $.CONSUME(ArrayToken); // "array"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.arrayEveryFn) }, // "array.every"
      { ALT: () => $.SUBRULE($.arrayFilterCountFn) }, // "array.filter_count"
      { ALT: () => $.SUBRULE($.arrayFilterFn) }, // "array.filter"
      { ALT: () => $.SUBRULE($.arrayFindFn) }, // "array.find"
      { ALT: () => $.SUBRULE($.arrayFindIndexFn) }, // "array.find_index"
      { ALT: () => $.SUBRULE($.arrayHasFn) }, // "array.has"
      { ALT: () => $.SUBRULE($.arrayShiftFn) }, // "array.shift"
      { ALT: () => $.SUBRULE($.arrayPopFn) }, // "array.pop"
      { ALT: () => $.SUBRULE($.arrayUnshiftFn) }, // "array.unshift"
      { ALT: () => $.SUBRULE($.arrayPushFn) }, // "array.push"
      { ALT: () => $.SUBRULE($.arrayMergeFn) }, // "array.merge"
      { ALT: () => $.SUBRULE($.arrayMapFn) }, // "array.map"
      { ALT: () => $.SUBRULE($.arrayPartitionFn) }, // "array.partition"
      { ALT: () => $.SUBRULE($.arrayGroupByFn) }, // "array.group_by"
      { ALT: () => $.SUBRULE($.arrayUnionFn) }, // "array.union"
      { ALT: () => $.SUBRULE($.arrayDifferenceFn) }, // "array.difference"
      { ALT: () => $.SUBRULE($.arrayIntersectionFn) }, // "array.intersection"
    ]);
    $.sectionStack.pop();
  };
}
