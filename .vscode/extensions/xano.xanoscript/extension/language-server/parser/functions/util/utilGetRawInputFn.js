import { GetRawInputToken } from "../../../lexer/util.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilGetRawInputFn($) {
  // util.get_raw_input as $x3
  return () => {
    $.sectionStack.push("utilGetRawInputFn");
    const fnToken = $.CONSUME(GetRawInputToken); // "get_raw_input"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          "encoding?": ["json", "yaml", "x-www-form-urlencoded", ""],
          "description?": "[string]",
          "disabled?": "[boolean]",
          "exclude_middleware?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
