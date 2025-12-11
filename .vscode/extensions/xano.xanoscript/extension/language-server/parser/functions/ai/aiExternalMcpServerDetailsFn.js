import { ServerDetailsToken } from "../../../lexer/ai.js";

/**
 * Handles server_details part of ai.external.mcp.server_details statement
 * Note: "external", "mcp" and dots are already consumed in aiFn
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function aiExternalMcpServerDetailsFn($) {
  return () => {
    $.sectionStack.push("aiExternalMcpServerDetailsFn");
    const fnToken = $.CONSUME(ServerDetailsToken); // "server_details"

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          url: "[expression]",
          bearer_token: "[expression]",
          connection_type: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
