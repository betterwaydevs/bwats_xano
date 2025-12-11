import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "workspace"
export const WorkspaceToken = createTokenByName("workspace", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const WorkspaceTokens = [WorkspaceToken];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case WorkspaceToken.name:
      return "keyword";
    default:
      return null;
  }
}
