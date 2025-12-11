import { TextDocuments } from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";

// Manage open text documents
export const documents = new TextDocuments(TextDocument);
