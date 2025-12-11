import { lexDocument } from "../lexer/lexer.js";
import { xanoscriptParser } from "../parser/parser.js";
import { getSchemeFromContent } from "../utils.js";

/**
 *
 * @param {import('vscode-languageserver-protocol').HoverParams} params
 * @param {import('vscode-languageserver-textdocument').TextDocuments} documents
 * @returns
 */
export function onHoverDocument(params, documents, hoverProviders = []) {
  const document = documents.get(params.textDocument.uri);

  if (!document) {
    console.error(
      "onHover(): Document not found for URI:",
      params.textDocument.uri
    );
    return null;
  }

  const text = document.getText();
  const offset = document.offsetAt(params.position);

  // Tokenize the document
  const lexResult = lexDocument(text);
  if (lexResult.errors.length > 0) return null;

  // attempt to get the scheme from the document uri
  const scheme = getSchemeFromContent(text);

  // Parse the XanoScript file
  const parser = xanoscriptParser(text, scheme);
  const tokens = lexResult.tokens;

  // Find the token under the cursor
  const tokenIdx = tokens.findIndex(
    (token) => token.startOffset <= offset && token.endOffset >= offset
  );

  if (tokenIdx === -1) {
    return null;
  }

  // Find the hover provider that matches the token
  const messageProvider = hoverProviders.find((provider) =>
    provider.isMatch(tokenIdx, tokens, parser)
  );

  if (messageProvider) {
    return {
      contents: {
        kind: "markdown",
        value: messageProvider.render(tokenIdx, tokens, parser),
      },
      range: {
        start: document.positionAt(tokens[tokenIdx].startOffset),
        end: document.positionAt(tokens[tokenIdx].endOffset + 1),
      },
    };
  }

  return null;
}
