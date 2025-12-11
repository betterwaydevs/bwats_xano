import { HoverMessageProvider } from "./HoverMessageProvider.js";

// read the `queryFilters.md` file to gather all the filters
// each filter starts with `# filter_name`
export class QueryFilterMessageProvider extends HoverMessageProvider {
  /**
   * @param {string} queryFiltersMd
   */
  constructor(queryFiltersMd) {
    super();
    this.parseFilters(queryFiltersMd);
  }

  /**
   * parser a markdown documentation text to extract all the filters
   * and their documentation
   * @param {string} content
   */
  parseFilters(content) {
    this.__filterDoc = {};
    let body = [];
    let fn = "";
    for (let line of content.split("\n")) {
      if (line.startsWith("#")) {
        if (fn) {
          this.__filterDoc[fn] = body.join("\n").trim();
        }

        fn = line.slice(2).trim();
        body = [];
      } else {
        body.push(line);
      }
    }

    if (fn && body.length) {
      this.__filterDoc[fn] = body.join("\n").trim();
    }
  }

  /**
   * find a filter by its index in the token stream
   * @param {int} index
   * @param {import("chevrotain").[]} tokens
   * @returns {string|null} the filter name or null if not found
   */
  findFilter(index, tokens) {
    const token = tokens[index];

    // Check if it's an Identifier token or has Identifier as a category/longer_alt
    const isIdentifierLike =
      token.tokenType.name === "Identifier" ||
      (token.tokenType.LONGER_ALT &&
        token.tokenType.LONGER_ALT.name === "Identifier") ||
      (token.tokenType.CATEGORIES &&
        token.tokenType.CATEGORIES.some((cat) => cat.name === "Identifier"));

    if (!isIdentifierLike) {
      return null;
    }

    const name = token.image;
    if (this.__filterDoc[name]) {
      return name;
    }

    return null;
  }

  // eslint-disable-next-line no-unused-vars
  isMatch(index, tokens, parser) {
    // Check if this looks like a filter after a pipe (|) in a search context
    if (index === 0) {
      return false;
    }

    const prevToken = tokens[index - 1];
    const isAfterPipe = prevToken.image === "|";

    if (!isAfterPipe) {
      return false;
    }

    // For query filters, we need to check if we're inside a search context
    // Look backwards to find "search" and "=" tokens
    for (let i = index - 2; i >= 0; i--) {
      const token = tokens[i];

      // If we find "where" followed by "=", this is a search context
      if (
        token.image === "where" &&
        i + 1 < tokens.length &&
        tokens[i + 1].image === "="
      ) {
        // Found "where =" pattern, this is a query filter context
        return !!this.findFilter(index, tokens);
      }

      // Stop looking if we hit certain boundary tokens that indicate we're outside the search context
      if (
        token.image === "{" ||
        token.image === "}" ||
        token.image === "\n" ||
        token.image === "query"
      ) {
        break;
      }
    }

    return false;
  }

  render(index, tokens) {
    const fn = this.findFilter(index, tokens);

    if (fn) {
      return this.__filterDoc[fn];
    }

    return undefined;
  }
}
