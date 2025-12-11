import { SetToken } from "../../../lexer/redis.js";

/**
 * redis.set {
 *   key = "name"
 *   data = "xano"
 *   ttl = 0
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisSetFn($) {
  return () => {
    $.sectionStack.push("redisSetFn");
    const fnToken = $.CONSUME(SetToken); // "set"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          data: "[expression]",
          ttl: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.sectionStack.pop();
  };
}
