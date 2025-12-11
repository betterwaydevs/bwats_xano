import { IncrToken } from "../../../lexer/redis.js";

/**
 * redis.incr {
 *   key = "counter"
 *   by = 1
 * } as $x3
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisIncrFn($) {
  return () => {
    $.sectionStack.push("redisIncrFn");
    const fnToken = $.CONSUME(IncrToken); // "incr"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          by: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
