import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "actions"
export const ActionsToken = createTokenByName("actions", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "active"
export const ActiveToken = createTokenByName("active", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "datasources"
export const DatasourcesToken = createTokenByName("datasources", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "table_trigger"
export const TableTriggerToken = createTokenByName("table_trigger", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const TableTriggerTokens = [
  ActionsToken,
  ActiveToken,
  DatasourcesToken,
  TableTriggerToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActionsToken.name:
    case TableTriggerToken.name:
      return "keyword";
    case ActiveToken.name:
    case DatasourcesToken.name:
      return "variable";
    default:
      return null;
  }
}
