import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// var
export const VarToken = createTokenByName("var", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// var.update
export const UpdateToken = createTokenByName("update", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const VarTokens = [VarToken, UpdateToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case VarToken.name:
    case UpdateToken.name:
      return "function";
    default:
      return null;
  }
}
