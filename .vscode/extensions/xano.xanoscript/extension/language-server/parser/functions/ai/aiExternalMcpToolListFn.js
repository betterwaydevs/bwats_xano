import { ListToken } from "../../../lexer/ai.js";

/**
 * Handles the list part of ai.external.mcp.tool.list statement
 * Note: "external", "mcp", "tool" and dots are already consumed in aiFn
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function aiExternalMcpToolListFn($) {
  return () => {
    $.sectionStack.push("aiExternalMcpToolListFn");
    const fnToken = $.CONSUME(ListToken); // "list"

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
