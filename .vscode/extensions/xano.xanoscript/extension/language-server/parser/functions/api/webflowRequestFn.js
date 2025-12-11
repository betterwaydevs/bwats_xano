import { RequestToken } from "../../../lexer/api.js";

// api.request {
//   url = "https://www.example.com"
//   method = "POST"
//   params = {}|set:"foo":"bar"
//   headers = []|push:"Set-Cookie: sessionId=e8bb43229de9; Domain=foo.example.com"
//   timeout = 25
//   ca_certificate = ""
//   certificate = ""
//   certificate_pass = ""
//   private_key = ""
// } as api1

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function webflowRequestFn($) {
  return () => {
    $.sectionStack.push("webflowRequestFn");
    const fnToken = $.CONSUME(RequestToken); // "request"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          path: "[expression]",
          method: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "params?": "[expression]",
          "headers?": "[expression]",
          "timeout?": "[number]",
          "follow_location?": "[expression]",
          "ca_certificate?": "[string]",
          "certificate?": "[string]",
          "certificate_pass?": "[string]",
          "private_key?": "[string]",
          "verify_host?": "[boolean]",
          "verify_peer?": "[boolean]",
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
