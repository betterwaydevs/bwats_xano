import { RequestToken } from "../../../lexer/cloud.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAlgoliaRequestFn($) {
  return () => {
    $.sectionStack.push("cloudAlgoliaRequestFn");
    const fnToken = $.CONSUME(RequestToken); // "request"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          "description?": "[string]",
          "application_id?": "[expression]",
          "api_key?": "[expression]",
          url: "[expression]",
          "method?": ["POST", "GET"],
          payload: "[expression]",
        },
      ],
    }); // e.g., .algolia
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
