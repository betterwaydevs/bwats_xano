import { HasToken } from "../../../lexer/redis.js";

/**
 * redis.has {
 *   key = "name"
 * } as $x2
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisHasFn($) {
  return () => {
    $.sectionStack.push("redisHasFn");
    const fnToken = $.CONSUME(HasToken); // "has"
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
