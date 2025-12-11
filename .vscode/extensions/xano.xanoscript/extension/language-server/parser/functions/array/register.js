import { arrayDifferenceFn } from "./arrayDifferenceFn.js";
import { arrayEveryFn } from "./arrayEveryFn.js";
import { arrayFilterCountFn } from "./arrayFilterCountFn.js";
import { arrayFilterFn } from "./arrayFilterFn.js";
import { arrayFindFn } from "./arrayFindFn.js";
import { arrayFindIndexFn } from "./arrayFindIndexFn.js";
import { arrayGroupByFn } from "./arrayGroupByFn.js";
import { arrayHasFn } from "./arrayHasFn.js";
import { arrayIntersectionFn } from "./arrayIntersectionFn.js";
import { arrayMapFn } from "./arrayMapFn.js";
import { arrayMergeFn } from "./arrayMergeFn.js";
import { arrayNoValueAs } from "./arrayNoValueAs.js";
import { arrayPartitionFn } from "./arrayPartitionFn.js";
import { arrayPopFn } from "./arrayPopFn.js";
import { arrayPushFn } from "./arrayPushFn.js";
import { arrayShiftFn } from "./arrayShiftFn.js";
import { arrayUnionFn } from "./arrayUnionFn.js";
import { arrayUnshiftFn } from "./arrayUnshiftFn.js";
import { arrayValueIfAs } from "./arrayValueIfAs.js";
import { arrayValueOnly } from "./arrayValueOnly.js";
import { valueAttrOnly } from "./valueAttrOnly.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.arrayEveryFn = $.RULE("arrayEveryFn", arrayEveryFn($));
  $.arrayFilterCountFn = $.RULE("arrayFilterCountFn", arrayFilterCountFn($));
  $.arrayFilterFn = $.RULE("arrayFilterFn", arrayFilterFn($));
  $.arrayFindFn = $.RULE("arrayFindFn", arrayFindFn($));
  $.arrayFindIndexFn = $.RULE("arrayFindIndexFn", arrayFindIndexFn($));
  $.arrayHasFn = $.RULE("arrayHasFn", arrayHasFn($));
  $.arrayMergeFn = $.RULE("arrayMergeFn", arrayMergeFn($));
  $.arrayNoValueAs = $.RULE("arrayNoValueAs", arrayNoValueAs($));
  $.arrayPopFn = $.RULE("arrayPopFn", arrayPopFn($));
  $.arrayPushFn = $.RULE("arrayPushFn", arrayPushFn($));
  $.arrayShiftFn = $.RULE("arrayShiftFn", arrayShiftFn($));
  $.arrayUnshiftFn = $.RULE("arrayUnshiftFn", arrayUnshiftFn($));
  $.arrayValueIfAs = $.RULE("arrayValueIfAs", arrayValueIfAs($));
  $.arrayValueOnly = $.RULE("arrayValueOnly", arrayValueOnly($));
  $.valueAttrOnly = $.RULE("valueAttrOnly", valueAttrOnly($));
  $.arrayMapFn = $.RULE("arrayMapFn", arrayMapFn($));
  $.arrayPartitionFn = $.RULE("arrayPartitionFn", arrayPartitionFn($));
  $.arrayGroupByFn = $.RULE("arrayGroupByFn", arrayGroupByFn($));
  $.arrayUnionFn = $.RULE("arrayUnionFn", arrayUnionFn($));
  $.arrayDifferenceFn = $.RULE("arrayDifferenceFn", arrayDifferenceFn($));
  $.arrayIntersectionFn = $.RULE("arrayIntersectionFn", arrayIntersectionFn($));
};
