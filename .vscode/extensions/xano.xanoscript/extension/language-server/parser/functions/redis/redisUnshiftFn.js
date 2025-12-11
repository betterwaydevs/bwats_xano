import { UnshiftToken } from "../../../lexer/redis.js";

/**
 * redis.unshift {
 *   key = "list"
 *   value = "zero"
 * } as $x6
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisUnshiftFn($) {
  return () => {
    $.sectionStack.push("redisUnshiftFn");
    const fnToken = $.CONSUME(UnshiftToken); // "unshift"
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
