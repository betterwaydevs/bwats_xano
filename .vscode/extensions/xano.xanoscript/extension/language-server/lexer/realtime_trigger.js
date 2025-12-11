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

// "realtime_trigger"
export const RealtimeTriggerToken = createTokenByName("realtime_trigger", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// realtime_channel
export const RealtimeChannelToken = createTokenByName("realtime_channel", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const RealtimeTriggerTokens = [
  ActionsToken,
  ActiveToken,
  RealtimeTriggerToken,
  RealtimeChannelToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ActionsToken.name:
    case RealtimeTriggerToken.name:
    case RealtimeChannelToken.name:
      return "keyword";
    case ActiveToken.name:
      return "variable";
    default:
      return null;
  }
}
