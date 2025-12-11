import { GetToken } from "../../../lexer/redis.js";

/**
 * redis.get {
 *   key = "xano"
 * } as $x1
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisGetFn($) {
  return () => {
    $.sectionStack.push("redisGetFn");
    const fnToken = $.CONSUME(GetToken); // "get"
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
