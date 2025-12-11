import { CountToken } from "../../../lexer/redis.js";

/**
 * redis.count {
 *   key = "list"
 * } as $x9
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisCountFn($) {
  return () => {
    $.sectionStack.push("redisCountFn");
    const fnToken = $.CONSUME(CountToken); // "count"
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
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
