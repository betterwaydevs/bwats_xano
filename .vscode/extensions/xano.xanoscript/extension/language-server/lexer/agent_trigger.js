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

// "agent_trigger"
export const AgentTriggerToken = createTokenByName("agent_trigger", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const AgentTriggerTokens = [
  ActionsToken,
  ActiveToken,
  AgentTriggerToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActionsToken.name:
    case AgentTriggerToken.name:
      return "keyword";
    case ActiveToken.name:
      return "variable";
    default:
      return null;
  }
}
