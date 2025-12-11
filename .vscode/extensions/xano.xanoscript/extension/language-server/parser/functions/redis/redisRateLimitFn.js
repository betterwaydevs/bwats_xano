import { RatelimitToken } from "../../../lexer/redis.js";

/**
 * redis.ratelimit {
 *   key = "list"
 *   max = 0
 *   ttl = 60
 *   error = ""
 * } as $ratelimit1
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisRateLimitFn($) {
  return () => {
    $.sectionStack.push("redisRateLimitFn");
    const fnToken = $.CONSUME(RatelimitToken); // "ratelimit"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          max: "[expression]",
          ttl: "[expression]",
          error: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
