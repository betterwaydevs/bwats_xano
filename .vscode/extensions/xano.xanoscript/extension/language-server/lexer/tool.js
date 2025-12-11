import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "instructions"
export const InstructionsToken = createTokenByName("instructions", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "tool"
export const ToolToken = createTokenByName("tool", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "tool.call"
export const CallToken = createTokenByName("call", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToolTokens = [InstructionsToken, ToolToken, CallToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ToolToken.name:
      return "keyword";
    case InstructionsToken.name:
      return "variable";
    case CallToken.name:
      return "function";
    default:
      return null;
  }
}
