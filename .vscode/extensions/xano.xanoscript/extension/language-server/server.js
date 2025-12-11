import {
  createConnection,
  ProposedFeatures,
  SemanticTokensBuilder,
  TextDocuments,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import { onCompletion } from "./onCompletion/onCompletion.js";
import { onDidChangeContent } from "./onDidChangeContent/onDidChangeContent.js";
import { onHover } from "./onHover/onHover.js";
import { onSemanticCheck } from "./onSemanticCheck/onSemanticCheck.js";
import { TOKEN_TYPES } from "./onSemanticCheck/tokens.js";

// Create a connection to the VS Code client
const connection = createConnection(ProposedFeatures.all);

// Manage open text documents
export const documents = new TextDocuments(TextDocument);

// Initialize the server
connection.onInitialize(() => {
  connection.console.log("XanoScript Language Server initialized");

  return {
    capabilities: {
      completionProvider: {
        resolveProvider: false, // We won't implement resolve for now (additional details for completions)
        triggerCharacters: [".", ":", "$", "|"], // Trigger completion on '.', ':', '$', '|' (e.g., for $variables and filters)
      },
      textDocumentSync: 1, // Full sync mode: server receives entire document content on change
      semanticTokensProvider: {
        documentSelector: [{ language: "xanoscript" }],
        legend: {
          tokenTypes: TOKEN_TYPES,
          tokenModifiers: [], // Optional, like 'static' or 'deprecated'
        },
        full: true, // Support full document highlighting
      },
      hoverProvider: true, // Enable hover support
    },
  };
});

connection.onHover((params) => onHover(params, documents));
connection.onCompletion((params) => onCompletion(params, documents));
connection.onRequest("textDocument/semanticTokens/full", (params) =>
  onSemanticCheck(params, documents, SemanticTokensBuilder)
);
documents.onDidChangeContent((params) =>
  onDidChangeContent(params, connection)
);
connection.onDidOpenTextDocument((params) => {
  console.log("Document opened:", params.textDocument.uri);
  // Existing handler logic
});

// Bind the document manager to the connection and start listening
documents.listen(connection);
connection.listen();
