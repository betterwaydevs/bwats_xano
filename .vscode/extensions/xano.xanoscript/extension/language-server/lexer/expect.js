import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

export const ExpectToken = createTokenByName("expect", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeTrueToken = createTokenByName("to_be_true", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeFalseToken = createTokenByName("to_be_false", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeInThePastToken = createTokenByName("to_be_in_the_past", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeInTheFutureToken = createTokenByName("to_be_in_the_future", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeDefinedToken = createTokenByName("to_be_defined", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToNotBeDefinedToken = createTokenByName("to_not_be_defined", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeNullToken = createTokenByName("to_be_null", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToNotBeNullToken = createTokenByName("to_not_be_null", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeEmptyToken = createTokenByName("to_be_empty", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToStartWithToken = createTokenByName("to_start_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToEndWithToken = createTokenByName("to_end_with", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeGreaterThanToken = createTokenByName("to_be_greater_than", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeLessThanToken = createTokenByName("to_be_less_than", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToMatchToken = createTokenByName("to_match", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToEqualToken = createTokenByName("to_equal", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToNotEqualToken = createTokenByName("to_not_equal", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToContainToken = createTokenByName("to_contain", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToBeWithinToken = createTokenByName("to_be_within", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ToThrowToken = createTokenByName("to_throw", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ExpectFnTokens = [
  ExpectToken,
  ToBeTrueToken,
  ToBeFalseToken,
  ToBeInThePastToken,
  ToBeInTheFutureToken,
  ToBeDefinedToken,
  ToNotBeDefinedToken,
  ToBeNullToken,
  ToNotBeNullToken,
  ToBeEmptyToken,
  ToStartWithToken,
  ToEndWithToken,
  ToBeGreaterThanToken,
  ToBeLessThanToken,
  ToMatchToken,
  ToEqualToken,
  ToNotEqualToken,
  ToContainToken,
  ToBeWithinToken,
  ToThrowToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ExpectToken.name:
    case ToBeTrueToken.name:
    case ToBeFalseToken.name:
    case ToBeInThePastToken.name:
    case ToBeInTheFutureToken.name:
    case ToBeDefinedToken.name:
    case ToNotBeDefinedToken.name:
    case ToBeNullToken.name:
    case ToNotBeNullToken.name:
    case ToBeEmptyToken.name:
    case ToStartWithToken.name:
    case ToEndWithToken.name:
    case ToBeGreaterThanToken.name:
    case ToBeLessThanToken.name:
    case ToMatchToken.name:
    case ToEqualToken.name:
    case ToNotEqualToken.name:
    case ToContainToken.name:
    case ToBeWithinToken.name:
    case ToThrowToken.name:
      return "function";
    default:
      return null;
  }
}
