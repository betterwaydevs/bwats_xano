import {
  AgentToken,
  AiToken,
  ExternalToken,
  McpToken,
  ToolToken,
} from "../../lexer/ai.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * Handles ai.* statements
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function aiFn($) {
  return () => {
    $.sectionStack.push("ai");
    $.CONSUME(AiToken); // "ai"
    $.CONSUME(DotToken); // "."
    $.OR([
      {
        ALT: () => {
          $.CONSUME(AgentToken); // "agent"
          $.CONSUME1(DotToken);
          $.SUBRULE($.aiAgentRunFn); // "ai.agent.run"
        },
      },
      {
        ALT: () => {
          $.CONSUME(ExternalToken); // "external"
          $.CONSUME2(DotToken); // "."
          $.CONSUME(McpToken); // "mcp"
          $.CONSUME3(DotToken); // "."

          $.OR1([
            {
              // "ai.external.mcp.server_details"
              ALT: () => $.SUBRULE($.aiExternalMcpServerDetailsFn),
            },
            {
              ALT: () => {
                $.CONSUME(ToolToken); // "tool"
                $.CONSUME4(DotToken); // "."
                $.OR2([
                  {
                    // "ai.external.mcp.tool.list"
                    ALT: () => $.SUBRULE($.aiExternalMcpToolListFn),
                  },
                  {
                    // "ai.external.mcp.tool.run"
                    ALT: () => $.SUBRULE($.aiExternalMcpToolRunFn),
                  },
                ]);
              },
            },
          ]);
        },
      },
    ]);
    $.sectionStack.pop();
  };
}
