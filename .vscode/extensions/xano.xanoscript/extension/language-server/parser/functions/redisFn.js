import { RedisToken } from "../../lexer/redis.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function redisFn($) {
  return () => {
    $.sectionStack.push("redis");
    $.CONSUME(RedisToken); // "redis"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.redisDelFn) }, // redis.del
      { ALT: () => $.SUBRULE($.redisSetFn) }, // redis.set
      { ALT: () => $.SUBRULE($.redisGetFn) }, // redis.get
      { ALT: () => $.SUBRULE($.redisHasFn) }, // redis.has
      { ALT: () => $.SUBRULE($.redisIncrFn) }, // redis.incr
      { ALT: () => $.SUBRULE($.redisDecrFn) }, // redis.decr
      { ALT: () => $.SUBRULE($.redisKeysFn) }, // redis.keys
      { ALT: () => $.SUBRULE($.redisPushFn) }, // redis.push
      { ALT: () => $.SUBRULE($.redisUnshiftFn) }, // redis.unshift
      { ALT: () => $.SUBRULE($.redisPopFn) }, // redis.pop
      { ALT: () => $.SUBRULE($.redisShiftFn) }, // redis.shift
      { ALT: () => $.SUBRULE($.redisRemoveFn) }, // redis.remove
      { ALT: () => $.SUBRULE($.redisCountFn) }, // redis.count
      { ALT: () => $.SUBRULE($.redisRangeFn) }, // redis.range
      { ALT: () => $.SUBRULE($.redisRateLimitFn) }, // redis.ratelimit
    ]);
    $.sectionStack.pop();
  };
}
