import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "table"
export const TableToken = createTokenByName("table", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "autocomplete"
export const AutoCompleteToken = createTokenByName("autocomplete", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "items"
export const ItemsToken = createTokenByName("items", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const TableTokens = [TableToken, AutoCompleteToken, ItemsToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case TableToken.name:
      return "keyword";
    case AutoCompleteToken.name:
    case ItemsToken.name:
      return "identifier";
    default:
      return null;
  }
}
