import { DirectQueryToken } from "../../../lexer/db.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbDirectQueryFn($) {
  return () => {
    $.sectionStack.push("dbDirectQueryFn");
    const fnToken = $.CONSUME(DirectQueryToken); // "direct_query"

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          sql: "[expression]",
          "response_type?": ["list", "single"],
          "parser?": ["template_engine", "prepared"],
          "description?": "[string]",
          "disabled?": "[boolean]",
          "arg*": "[expression]",
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });

    // $.SUBRULE($.functionAttrReq, {
    //   ARGS: [
    //     fnToken,
    //     requiredAttrs,
    //     optionalAttrs,
    //     { allowDuplicates: ["arg"] },
    //   ],
    // });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
