import { RemoveToken } from "../../../lexer/redis.js";

/**
 * redis.remove {
 *   key = "list"
 *   value = "FIRST"
 *   count = ""
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisRemoveFn($) {
  return () => {
    $.sectionStack.push("redisRemoveFn");
    const fnToken = $.CONSUME(RemoveToken); // "remove"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          value: "[expression]",
          count: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.sectionStack.pop();
  };
}
