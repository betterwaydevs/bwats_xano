import { mapToVirtualJS } from "../embedded/embeddedContent.js";
import { getSchemeFromContent } from "../utils.js";
import { getContentAssistSuggestions } from "./contentAssist.js";

/**
 *
 * @param {import('vscode-languageserver-protocol').CompletionParams} params
 * @param {import('vscode-languageserver').TextDocuments} documents
 * @returns
 */
export function onCompletion(params, documents) {
  const document = documents.get(params.textDocument.uri);

  if (!document) {
    console.error(
      "onCompletion(): Document not found for URI:",
      params.textDocument.uri
    );
    return null;
  }

  const position = params.position;
  const text = document.getText();
  const offset = document.offsetAt(position);

  // Check if we're in an embedded JavaScript region
  const virtualPos = mapToVirtualJS(offset, text);
  if (virtualPos) {
    // We're in embedded JS - return null to let VS Code's JS service handle it
    // The virtual document provider will expose the JS content
    return null;
  }

  // Otherwise, handle as regular XanoScript
  const scheme = getSchemeFromContent(text);

  return getContentAssistSuggestions(text.slice(0, offset), scheme);
}
