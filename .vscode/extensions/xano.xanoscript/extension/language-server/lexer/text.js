import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// text
export const TextToken = createTokenByName("text", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// append
export const AppendToken = createTokenByName("append", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// contains
export const ContainsToken = createTokenByName("contains", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// ends_with
export const EndsWithToken = createTokenByName("ends_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// icontains
export const IContainsToken = createTokenByName("icontains", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// iends_with
export const IEndsWithToken = createTokenByName("iends_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// istarts_with
export const IStartsWithToken = createTokenByName("istarts_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// ltrim
export const LTrimToken = createTokenByName("ltrim", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// prepend
export const PrependToken = createTokenByName("prepend", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// rtrim
export const RTrimToken = createTokenByName("rtrim", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// starts_with
export const StartsWithToken = createTokenByName("starts_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// trim
export const TrimToken = createTokenByName("trim", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const TextTokens = [
  TextToken,
  AppendToken,
  ContainsToken,
  EndsWithToken,
  IContainsToken,
  IEndsWithToken,
  IStartsWithToken,
  LTrimToken,
  PrependToken,
  RTrimToken,
  StartsWithToken,
  TrimToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case TextToken.name:
      return "namespace";
    case AppendToken.name:
    case ContainsToken.name:
    case EndsWithToken.name:
    case IContainsToken.name:
    case IEndsWithToken.name:
    case IStartsWithToken.name:
    case LTrimToken.name:
    case PrependToken.name:
    case RTrimToken.name:
    case StartsWithToken.name:
    case TrimToken.name:
      return "method";
    default:
      return null;
  }
}
