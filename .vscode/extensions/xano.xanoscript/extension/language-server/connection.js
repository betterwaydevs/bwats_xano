import {
  createConnection,
  ProposedFeatures,
} from "vscode-languageserver/node.js";

// Create a connection to the VS Code client
export const connection = createConnection(ProposedFeatures.all);
