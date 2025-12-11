import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "ai"
export const AiToken = createTokenByName("ai", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "agent" - note: also defined in agent.js for agent definitions
// This is used in the context of ai.agent.run
export const AgentToken = createTokenByName("agent", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "run"
export const RunToken = createTokenByName("run", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "external"
export const ExternalToken = createTokenByName("external", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "mcp"
export const McpToken = createTokenByName("mcp", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "tool"
export const ToolToken = createTokenByName("tool", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "list"
export const ListToken = createTokenByName("list", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "server_details"
export const ServerDetailsToken = createTokenByName("server_details", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const AiTokens = [
  AiToken,
  AgentToken,
  RunToken,
  ExternalToken,
  McpToken,
  ToolToken,
  ListToken,
  ServerDetailsToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case AiToken.name:
    case AgentToken.name:
    case RunToken.name:
    case ExternalToken.name:
    case McpToken.name:
    case ToolToken.name:
    case ListToken.name:
    case ServerDetailsToken.name:
      return "keyword";
    default:
      return null;
  }
}
