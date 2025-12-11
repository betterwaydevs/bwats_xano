import { HoverMessageProvider } from "./HoverMessageProvider.js";

// read the `filters.md` file to gather all the filters
// each filter starts with `# filter_name`
export class InputFilterMessageProvider extends HoverMessageProvider {
  /**
   * @param {string} functionsMd
   */
  constructor(functionsMd) {
    super();
    this.parseFilters(functionsMd);
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
    // Check if this looks like a filter (either after = or after |)
    if (index === 0) {
      return false;
    }

    const prevToken = tokens[index - 1];
    const isAfterEquals = prevToken.image === "=";
    const isAfterPipe = prevToken.image === "|";

    if (!isAfterEquals && !isAfterPipe) {
      return false;
    }

    // For input filters, we need to check if there's a "filters" token before the "=" token
    if (isAfterEquals) {
      // Look backwards to find "filters" token
      for (let i = index - 2; i >= 0; i--) {
        const token = tokens[i];
        if (token.image === "filters") {
          // Found "filters" token, this is likely an input filter context
          return !!this.findFilter(index, tokens);
        }
        // Stop looking if we hit certain boundary tokens
        if (
          token.image === "{" ||
          token.image === "}" ||
          token.image === "\n"
        ) {
          break;
        }
      }
      return false;
    }

    // For pipe filters, check if we're in an input filter chain (filters=something|this_token)
    if (isAfterPipe) {
      // Look backwards to find if there's a "filters=" pattern
      for (let i = index - 2; i >= 0; i--) {
        const token = tokens[i];
        if (token.image === "=" && i > 0 && tokens[i - 1].image === "filters") {
          // Found "filters=" pattern, this is an input filter context
          return !!this.findFilter(index, tokens);
        }
        // Stop looking if we hit certain boundary tokens that would indicate we're outside the filter chain
        // Don't stop at intermediate pipes - they're part of the filter chain
        if (
          token.image === "{" ||
          token.image === "}" ||
          token.image === "\n"
        ) {
          break;
        }
      }
      return false;
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
