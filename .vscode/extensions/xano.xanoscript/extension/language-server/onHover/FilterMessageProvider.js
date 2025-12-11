import { HoverMessageProvider } from "./HoverMessageProvider.js";

// read the `filters.md` file to gather all the filters
// each filter starts with `# filter_name`
export class FilterMessageProvider extends HoverMessageProvider {
  /**
   * @param {string} filtersMd
   */
  constructor(filtersMd) {
    super();
    this.parseFilters(filtersMd);
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
        // every filter name starts with a '#'
        if (fn) {
          this.__filterDoc[fn] = body.join("\n");
        }

        // remove the leading '#' and trim
        fn = line.slice(1).trim();

        // if the function starts with '!' it's deprecated
        // # !old_filter:new_filter
        if (fn.startsWith("!")) {
          const [deprecatedFilter, recommended] = fn
            .slice(1)
            .split(":")
            .map((p) => p.trim())
            .filter((p) => p);
          if (recommended) {
            this.__filterDoc[
              deprecatedFilter
            ] = `\`${deprecatedFilter}\` is deprecated, use \`${recommended}\` instead.`;
          }
          fn = "";
        }

        body = [];
      } else {
        body.push(line);
      }
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
    // a filter always starts with a |
    if (index === 0 || tokens[index - 1].image !== "|") {
      return false;
    }

    return !!this.findFilter(index, tokens);
  }

  render(index, tokens) {
    const fn = this.findFilter(index, tokens);

    if (fn) {
      return this.__filterDoc[fn];
    }
  }
}
