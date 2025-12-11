import { lexDocument } from "../lexer/lexer.js";
import { mapTokenToType } from "../lexer/tokens.js";
import { encodeTokenType } from "./tokens.js";

/**
 *
 * @param {string} scheme The scheme of the document (db:/, task:/, api:/...)
 * @param {string} text The source code to be highlighted
 * @param {SemanticTokensBuilder} SemanticTokensBuilder The semantic tokens builder constructor for node or browser
 * @returns {SemanticTokensBuilder} Returns null if the scheme is not supported
 */
export function higlightText(scheme, text, SemanticTokensBuilder) {
  return higlightDefault(text, SemanticTokensBuilder);
}

function higlightDefault(text, SemanticTokensBuilder) {
  const builder = new SemanticTokensBuilder();

  // Map Chevrotain tokens to semantic token types
  // Enable disabled statements
  const lexResult = lexDocument(text, true);

  lexResult.tokens.forEach((token) => {
    const tokenType = mapTokenToType(token.tokenType.name);
    if (tokenType) {
      const line = token.startLine - 1; // Convert to 0-based for LSP
      const character = token.startColumn - 1; // Convert to 0-based for LSP
      builder.push(
        line,
        character,
        token.image.length, // Length of the token
        encodeTokenType(tokenType), // Numeric ID for the token type
        0 // No modifiers for now
      );
    } else if (tokenType === undefined) {
      console.log(
        `token type not mapped to a type: ${JSON.stringify(
          token.tokenType.name
        )}`
      );
    }
  });

  return builder.build();
}
