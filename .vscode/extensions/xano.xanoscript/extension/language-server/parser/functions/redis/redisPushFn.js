import { PushToken } from "../../../lexer/redis.js";

/**
 * redis.push {
 *   key = "list"
 *   value = "second"
 * } as $x5
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisPushFn($) {
  return () => {
    $.sectionStack.push("redisPushFn");
    const fnToken = $.CONSUME(PushToken); // "push"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          key: "[expression]",
          value: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
