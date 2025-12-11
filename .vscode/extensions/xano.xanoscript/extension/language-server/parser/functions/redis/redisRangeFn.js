import { RangeToken } from "../../../lexer/redis.js";

/**
 * redis.range {
 *   key = "list"
 *   start = 0
 *   stop = 1
 * } as $x10
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisRangeFn($) {
  return () => {
    $.sectionStack.push("redisRangeFn");
    const fnToken = $.CONSUME(RangeToken); // "range"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          start: "[expression]",
          stop: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
