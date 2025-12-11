import { FromRequestToken } from "../../../lexer/stream.js";

/**
 * stream.from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}
      headers = []
      timeout = 10
      follow_location = true
      verify_host = false
      verify_peer = false
      ca_certificate = ""
      certificate = ""
      certificate_pass = ""
      private_key = ""
      private_key_pass = ""
    } as stream1
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function streamFromRequestFn($) {
  return () => {
    $.sectionStack.push("streamFromRequest");
    const fnToken = $.CONSUME(FromRequestToken); // from_request
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          url: "[expression]",
          method: "[expression]",
          "params?": "[expression]",
          "headers?": "[expression]",
          "timeout?": "[expression]",
          "follow_location?": "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "verify_host?": "[expression]",
          "verify_peer?": "[expression]",
          "ca_certificate?": "[expression]",
          "certificate?": "[expression]",
          "certificate_pass?": "[expression]",
          "private_key?": "[expression]",
          "private_key_pass?": "[expression]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
