import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

export const QueryToken = createTokenByName("query", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const VerbToken = createTokenByName("verb", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// Following are the method for query endpoints
export const GETToken = createTokenByName("GET", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const PATCHToken = createTokenByName("PATCH", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});
export const POSTToken = createTokenByName("POST", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});
export const PUTToken = createTokenByName("PUT", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});
export const DELETEToken = createTokenByName("DELETE", {
  categories: [Identifier], // could also be an identifier
  longer_alt: Identifier,
});

// response_type
export const ResponseTypeToken = createTokenByName("response_type", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// dblink
export const DbLinkToken = createTokenByName("dblink", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// output
export const OutputToken = createTokenByName("output", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// addon
export const AddonToken = createTokenByName("addon", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const QueryTokens = [
  ResponseTypeToken,
  QueryToken,
  VerbToken,
  GETToken,
  PATCHToken,
  POSTToken,
  PUTToken,
  DELETEToken,
  DbLinkToken,
  OutputToken,
  AddonToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case QueryToken.name:
    case VerbToken.name:
    case ResponseTypeToken.name:
      return "keyword";
    case GETToken.name:
    case PATCHToken.name:
    case POSTToken.name:
    case PUTToken.name:
    case DELETEToken.name:
      return "enumMember";

    case DbLinkToken.name:
    case OutputToken.name:
    case AddonToken.name:
      return "property";
    default:
      return null;
  }
}
