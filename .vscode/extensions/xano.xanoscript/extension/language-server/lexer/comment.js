import { createUniqToken } from "./utils.js";

// Comment token - captures entire line comments starting with //
// Comments can only be on empty lines (nothing before the comment except whitespace)
export const CommentToken = createUniqToken({
  name: "CommentToken",
  label: "// comment",
  pattern: {
    exec: (text, offset) => {
      // Look for the `//` marker at the current offset
      if (!text.slice(offset).startsWith("//")) {
        return null;
      }

      // Allow if at the start of input
      if (offset === 0) {
        return text.slice(offset).match(/.*(?=\n|$)/);
      }

      // Look backwards from offset to check what comes before
      // We need to find only whitespace (spaces/tabs) or a newline before the comment
      let checkOffset = offset - 1;
      while (checkOffset >= 0) {
        const char = text[checkOffset];

        // If we find a newline, the comment is on its own line (possibly with leading whitespace)
        if (char === "\n" || char === "\r") {
          return text.slice(offset).match(/.*(?=\n|$)/);
        }

        // If we find anything other than space or tab, reject
        if (char !== " " && char !== "\t") {
          return null;
        }

        checkOffset--;
      }

      // If we've checked all the way to the start and only found whitespace, allow it
      return text.slice(offset).match(/.*(?=\n|$)/);
    },
  },
  // we don't capture more than one line
  line_breaks: false,
});

export const CommentTokens = [CommentToken];

/**
 * Map comment tokens to their semantic types
 * @param {string} tokenName - The name of the token
 * @returns {string|undefined} The semantic type
 */
export function mapTokenToType(tokenName) {
  switch (tokenName) {
    case CommentToken.name:
      return "comment";
    default:
      return undefined;
  }
}
