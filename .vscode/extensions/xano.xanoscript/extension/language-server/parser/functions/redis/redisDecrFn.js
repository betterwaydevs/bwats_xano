import { DecrToken } from "../../../lexer/redis.js";

/**
 * redis.decr {
 *   key = "counter"
 *   by = 1
 * } as $x4
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisDecrFn($) {
  return () => {
    $.sectionStack.push("redisDecrFn");
    const fnToken = $.CONSUME(DecrToken); // "decr"
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
