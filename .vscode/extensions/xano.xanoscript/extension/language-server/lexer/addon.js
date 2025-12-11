import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "addon"
export const AddonToken = createTokenByName("addon", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "addon.call"
export const CallToken = createTokenByName("call", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const AddonTokens = [AddonToken, CallToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case AddonToken.name:
      return "keyword";
    case CallToken.name:
      return "function";
    default:
      return null;
  }
}
