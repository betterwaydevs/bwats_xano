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

// "workspace_trigger"
export const WorkspaceTriggerToken = createTokenByName("workspace_trigger", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const WorkspaceTriggerTokens = [
  ActionsToken,
  ActiveToken,
  WorkspaceTriggerToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActionsToken.name:
    case WorkspaceTriggerToken.name:
      return "keyword";
    case ActiveToken.name:
      return "variable";
    default:
      return null;
  }
}
