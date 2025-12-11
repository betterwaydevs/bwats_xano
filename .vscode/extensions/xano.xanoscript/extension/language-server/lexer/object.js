import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// object
export const ObjectToken = createTokenByName("object", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// object.entries
export const EntriesToken = createTokenByName("entries", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// object.keys
export const KeysToken = createTokenByName("keys", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// object.values
export const ValuesToken = createTokenByName("values", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ObjectTokens = [ObjectToken, EntriesToken, KeysToken, ValuesToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ObjectToken.name:
    case EntriesToken.name:
    case KeysToken.name:
    case ValuesToken.name:
      return "function";
    default:
      return null;
  }
}
