import { readFileSync } from "fs";
import { mapToVirtualJS } from "../embedded/embeddedContent.js";
import { FilterMessageProvider } from "./FilterMessageProvider.js";
import { FunctionMessageProvider } from "./FunctionMessageProvider.js";
import { InputFilterMessageProvider } from "./InputFilterMessageProvider.js";
import { InputVariableMessageProvider } from "./InputVariableMessageProvider.js";
import { onHoverDocument } from "./onHoverDocument.js";
import { QueryFilterMessageProvider } from "./queryFilterMessageProvider.js";

const filtersMd = readFileSync(
  new URL("./filters.md", import.meta.url),
  "utf8"
);
const functionsMd = readFileSync(
  new URL("./functions.md", import.meta.url),
  "utf8"
);
const inputFiltersMd = readFileSync(
  new URL("./inputFilters.md", import.meta.url),
  "utf8"
);
const queryFiltersMd = readFileSync(
  new URL("./queryFilters.md", import.meta.url),
  "utf8"
);

const hoverProviders = [
  new InputVariableMessageProvider(),
  new FunctionMessageProvider(functionsMd),
  new InputFilterMessageProvider(inputFiltersMd), // Input filters (columnDefinition context)
  new FilterMessageProvider(filtersMd), // Regular filters (pipe context)
  new QueryFilterMessageProvider(queryFiltersMd), // Query filters (search context)
];

export function onHover(params, documents) {
  const document = documents.get(params.textDocument.uri);

  if (!document) {
    return null;
  }

  // Check if we're in an embedded JavaScript region
  const text = document.getText();
  const offset = document.offsetAt(params.position);
  const virtualPos = mapToVirtualJS(offset, text);

  if (virtualPos) {
    // We're in embedded JS - return null to let VS Code's JS service handle it
    return null;
  }

  // Otherwise, handle as regular XanoScript
  return onHoverDocument(params, documents, hoverProviders);
}
