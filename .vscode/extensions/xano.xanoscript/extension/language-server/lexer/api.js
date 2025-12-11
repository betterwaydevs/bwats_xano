import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "api"
export const ApiToken = createTokenByName("api", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "webflow"
export const WebflowToken = createTokenByName("webflow", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "api.request"
export const RequestToken = createTokenByName("request", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "api.call"
export const CallToken = createTokenByName("call", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// api.realtime_event
export const RealtimeEventToken = createTokenByName("realtime_event", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// api.stream
export const StreamToken = createTokenByName("stream", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "api.lambda"
export const LambdaToken = createTokenByName("lambda", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "api.microservice"
export const MicroserviceToken = createTokenByName("microservice", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ApiFnTokens = [
  ApiToken,
  WebflowToken,
  RequestToken,
  CallToken,
  RealtimeEventToken,
  StreamToken,
  LambdaToken,
  MicroserviceToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ApiToken.name:
    case WebflowToken.name:
    case RequestToken.name:
    case LambdaToken.name:
    case RealtimeEventToken.name:
    case StreamToken.name:
    case MicroserviceToken.name:
    case CallToken.name:
      return "function";
    default:
      return null;
  }
}
