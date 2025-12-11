import { DelToken } from "../../../lexer/redis.js";

/**
 * redis.del {
 *   key = "name"
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisDelFn($) {
  return () => {
    $.sectionStack.push("redisDelFn");
    const fnToken = $.CONSUME(DelToken); // "del"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.sectionStack.pop();
  };
}
