import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "call"
export const CallToken = createTokenByName("call", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "datasource"
export const DataSourceToken = createTokenByName("datasource", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "ends_on"
export const EndsOnToken = createTokenByName("ends_on", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "events"
export const EventsToken = createTokenByName("events", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "freq"
export const FreqToken = createTokenByName("freq", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "schedule"
export const ScheduleToken = createTokenByName("schedule", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "starts_on"
export const StartsOnToken = createTokenByName("starts_on", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "task"
export const TaskToken = createTokenByName("task", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const TaskTokens = [
  CallToken,
  DataSourceToken,
  EndsOnToken,
  EventsToken,
  FreqToken,
  ScheduleToken,
  StartsOnToken,
  TaskToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case DataSourceToken.name:
    case ScheduleToken.name:
    case TaskToken.name:
      return "keyword";
    case EndsOnToken.name:
    case EventsToken.name:
    case FreqToken.name:
    case StartsOnToken.name:
      return "variable";
    case CallToken.name:
      return "function";
    default:
      return null;
  }
}
