import { ShiftToken } from "../../../lexer/redis.js";

/**
 * redis.shift {
 *   key = "list"
 * } as $x8
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisShiftFn($) {
  return () => {
    $.sectionStack.push("redisShiftFn");
    const fnToken = $.CONSUME(ShiftToken); // "shift"
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
