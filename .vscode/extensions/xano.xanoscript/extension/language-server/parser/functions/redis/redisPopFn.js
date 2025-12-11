import { PopToken } from "../../../lexer/redis.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisPopFn($) {
  // redis.pop {
  //   key = "list"
  // } as $x7
  return () => {
    $.sectionStack.push("redisPopFn");
    const fnToken = $.CONSUME(PopToken); // "pop"
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
