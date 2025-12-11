import {
  BrowserMessageReader,
  BrowserMessageWriter,
  createConnection,
  SemanticTokensBuilder,
  TextDocuments,
} from "vscode-languageserver/browser";
import { TextDocument } from "vscode-languageserver-textdocument";
import { onCompletion } from "./onCompletion/onCompletion.js";
import { onDidChangeContent } from "./onDidChangeContent/onDidChangeContent.js";
import { onHover } from "./onHover/onHover.js";
import { onSemanticCheck } from "./onSemanticCheck/onSemanticCheck.js";
import { TOKEN_TYPES } from "./onSemanticCheck/tokens.js";

const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);

const documents = new TextDocuments(TextDocument);

// init connection
connection.onInitialize(() => {
  return {
    capabilities: {
      completionProvider: {
        resolveProvider: false,
        triggerCharacters: [".", ":", "$", "|"],
      },
      textDocumentSync: 1,
      semanticTokensProvider: {
        legend: {
          tokenTypes: TOKEN_TYPES,
          tokenModifiers: [],
        },
        full: true,
      },
      hoverProvider: true,
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
connection.onInitialized(() => console.log("lang server init"));
documents.listen(connection);
connection.listen();
