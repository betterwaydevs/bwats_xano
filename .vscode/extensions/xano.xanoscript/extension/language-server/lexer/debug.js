import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// debug
export const DebugToken = createTokenByName("debug", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// debug.stop
export const DebugStopToken = createTokenByName("stop", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// debug.log
export const DebugLogToken = createTokenByName("log", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const DebugTokens = [DebugToken, DebugStopToken, DebugLogToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case DebugToken.name:
    case DebugStopToken.name:
    case DebugLogToken.name:
      return "function";
    default:
      return null;
  }
}
