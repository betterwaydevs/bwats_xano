import { redisCountFn } from "./redisCountFn.js";
import { redisDecrFn } from "./redisDecrFn.js";
import { redisDelFn } from "./redisDelFn.js";
import { redisGetFn } from "./redisGetFn.js";
import { redisHasFn } from "./redisHasFn.js";
import { redisIncrFn } from "./redisIncrFn.js";
import { redisKeysFn } from "./redisKeysFn.js";
import { redisPopFn } from "./redisPopFn.js";
import { redisPushFn } from "./redisPushFn.js";
import { redisRangeFn } from "./redisRangeFn.js";
import { redisRateLimitFn } from "./redisRateLimitFn.js";
import { redisRemoveFn } from "./redisRemoveFn.js";
import { redisSetFn } from "./redisSetFn.js";
import { redisShiftFn } from "./redisShiftFn.js";
import { redisUnshiftFn } from "./redisUnshiftFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.redisCountFn = $.RULE("redisCountFn", redisCountFn($));
  $.redisDecrFn = $.RULE("redisDecrFn", redisDecrFn($));
  $.redisDelFn = $.RULE("redisDelFn", redisDelFn($));
  $.redisGetFn = $.RULE("redisGetFn", redisGetFn($));
  $.redisHasFn = $.RULE("redisHasFn", redisHasFn($));
  $.redisIncrFn = $.RULE("redisIncrFn", redisIncrFn($));
  $.redisKeysFn = $.RULE("redisKeysFn", redisKeysFn($));
  $.redisPopFn = $.RULE("redisPopFn", redisPopFn($));
  $.redisPushFn = $.RULE("redisPushFn", redisPushFn($));
  $.redisRangeFn = $.RULE("redisRangeFn", redisRangeFn($));
  $.redisRateLimitFn = $.RULE("redisRateLimitFn", redisRateLimitFn($));
  $.redisRemoveFn = $.RULE("redisRemoveFn", redisRemoveFn($));
  $.redisSetFn = $.RULE("redisSetFn", redisSetFn($));
  $.redisShiftFn = $.RULE("redisShiftFn", redisShiftFn($));
  $.redisUnshiftFn = $.RULE("redisUnshiftFn", redisUnshiftFn($));
};
