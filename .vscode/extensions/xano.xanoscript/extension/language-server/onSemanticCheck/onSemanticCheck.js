import { getSchemeFromContent } from "../utils.js";
import { higlightText } from "./highlight.js";

/**
 * Handles a semantic tokens request for the full document.
 * @param {import('vscode-languageserver-protocol').SemanticTokensParams} params - The parameters for the semantic tokens request.
 * @param {import('vscode-languageserver').TextDocuments} documents - The text documents manager.
 * @param {import('vscode-languageserver-protocol').SemanticTokensBuilder} SemanticTokensBuilder - The semantic tokens builder.
 */
export function onSemanticCheck(params, documents, SemanticTokensBuilder) {
  const document = documents.get(params.textDocument.uri);

  if (!document) {
    console.error(
      "onSemanticCheck(): Document not found for URI:",
      params.textDocument.uri
    );
    return null;
  }

  const text = document.getText();
  const scheme = getSchemeFromContent(text);

  return higlightText(scheme, text, SemanticTokensBuilder);
}
