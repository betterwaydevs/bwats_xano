import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "exception_policy"
export const ExceptionPolicyToken = createTokenByName("exception_policy", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "middleware"
export const MiddlewareToken = createTokenByName("middleware", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// "response_strategy"
export const ResponseStrategyToken = createTokenByName("response_strategy", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const MiddlewareTokens = [
  ExceptionPolicyToken,
  MiddlewareToken,
  ResponseStrategyToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case MiddlewareToken.name:
      return "keyword";
    case ExceptionPolicyToken.name:
    case ResponseStrategyToken.name:
      return "variable";
    default:
      return null;
  }
}
