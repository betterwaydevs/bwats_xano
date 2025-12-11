import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "datasource"
export const DatasourceToken = createTokenByName("datasource", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "workflow_test"
export const WorkflowTestToken = createTokenByName("workflow_test", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "exception"
export const ExceptionToken = createTokenByName("exception", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const WorkflowTestTokens = [
  DatasourceToken,
  WorkflowTestToken,
  ExceptionToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case WorkflowTestToken.name:
      return "keyword";
    case ExceptionToken.name:
    case DatasourceToken.name:
      return "variable";
    default:
      return null;
  }
}
