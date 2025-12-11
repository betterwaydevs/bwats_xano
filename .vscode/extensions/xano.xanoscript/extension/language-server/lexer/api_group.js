import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "active"
export const ActiveToken = createTokenByName("active", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "api_group"
export const ApiGroupToken = createTokenByName("api_group", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "canonical"
export const CanonicalToken = createTokenByName("canonical", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "cors"
export const CorsToken = createTokenByName("cors", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "swagger"
export const SwaggerToken = createTokenByName("swagger", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ApiGroupTokens = [
  ActiveToken,
  ApiGroupToken,
  CanonicalToken,
  CorsToken,
  SwaggerToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ApiGroupToken.name:
      return "keyword";
    case ActiveToken.name:
    case CanonicalToken.name:
    case CorsToken.name:
    case SwaggerToken.name:
      return "variable";
    default:
      return null;
  }
}
