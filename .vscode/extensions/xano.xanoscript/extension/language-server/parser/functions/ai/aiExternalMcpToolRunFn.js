import { RunToken } from "../../../lexer/ai.js";

/**
 * Handles the run part of ai.external.mcp.tool.run statement
 * Note: "external", "mcp", "tool" and dots are already consumed in aiFn
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function aiExternalMcpToolRunFn($) {
  return () => {
    $.sectionStack.push("aiExternalMcpToolRunFn");
    const fnToken = $.CONSUME(RunToken); // "run"

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          url: "[expression]",
          bearer_token: "[expression]",
          connection_type: "[expression]",
          tool: "[expression]",
          args: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
