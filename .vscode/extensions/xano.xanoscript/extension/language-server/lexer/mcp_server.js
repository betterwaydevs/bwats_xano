import { Identifier } from "./identifier.js";
import { ToolToken } from "./tool.js";
import { createTokenByName } from "./utils.js";

// "active"
export const ActiveToken = createTokenByName("active", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "instructions"
export const InstructionsToken = createTokenByName("instructions", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "mcp_server"
export const McpServerToken = createTokenByName("mcp_server", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "tools"
export const ToolsToken = createTokenByName("tools", {
  longer_alt: ToolToken,
  categories: [Identifier], // could also be an identifier
});

export const McpServerTokens = [
  ActiveToken,
  InstructionsToken,
  McpServerToken,
  ToolsToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActiveToken.name:
    case McpServerToken.name:
    case ToolsToken.name:
      return "keyword";
    case InstructionsToken.name:
      return "variable";
    default:
      return null;
  }
}
