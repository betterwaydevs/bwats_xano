import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// math
export const MathToken = createTokenByName("math", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// add
export const AddToken = createTokenByName("add", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// div
export const DivToken = createTokenByName("div", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// mod
export const ModToken = createTokenByName("mod", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// mul
export const MulToken = createTokenByName("mul", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// sub
export const SubToken = createTokenByName("sub", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// bitwise
export const BitwiseToken = createTokenByName("bitwise", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// and
export const AndToken = createTokenByName("and", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// or
export const OrToken = createTokenByName("or", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// xor
export const XorToken = createTokenByName("xor", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const MathTokens = [
  MathToken,
  AddToken,
  DivToken,
  ModToken,
  MulToken,
  SubToken,
  BitwiseToken,
  AndToken,
  OrToken,
  XorToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case MathToken.name:
    case AddToken.name:
    case DivToken.name:
    case ModToken.name:
    case MulToken.name:
    case SubToken.name:
    case BitwiseToken.name:
    case AndToken.name:
    case OrToken.name:
    case XorToken.name:
      return "function";
    default:
      return null;
  }
}
