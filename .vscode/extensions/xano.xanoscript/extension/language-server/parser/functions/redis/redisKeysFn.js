import { KeysToken } from "../../../lexer/redis.js";

/**
 * redis.keys {
 *   search = "name*"
 * } as $keys1
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function redisKeysFn($) {
  return () => {
    $.sectionStack.push("redisKeysFn");
    const fnToken = $.CONSUME(KeysToken); // "keys"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          search: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
