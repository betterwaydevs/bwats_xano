import { DirectQueryToken } from "../../../lexer/db.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbExternalDirectQueryFn($) {
  return () => {
    $.sectionStack.push("dbExternalDirectQueryFn");
    const fnToken = $.CONSUME(DirectQueryToken); // "direct_query"

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          sql: "[expression]",
          response_type: ["list", "single"],
          connection_string: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "arg*": "[expression]",
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
