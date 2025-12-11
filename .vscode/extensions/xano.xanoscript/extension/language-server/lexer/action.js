import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "action"
export const ActionToken = createTokenByName("action", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "action.call"
export const CallToken = createTokenByName("call", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ActionTokens = [ActionToken, CallToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActionToken.name:
      return "keyword";
    case CallToken.name:
      return "function";
    default:
      return null;
  }
}
