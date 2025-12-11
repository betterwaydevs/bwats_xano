import { HoverMessageProvider } from "./HoverMessageProvider.js";

// read the `functions.md` file to gather all the functions
// each function starts with `# function_name`
export class FunctionMessageProvider extends HoverMessageProvider {
  /**
   * @param {string} functionsMd
   */
  constructor(functionsMd) {
    super();

    this.parseFunctions(functionsMd);
    this.buildSearchTree();
  }

  /**
   * take every functions, break it down into words
   * and build a search tree in reverse order
   * api.foo.lambda will be
   *     {
   *       lambda: {
   *         foo: {
   *           api: {
   *             __value: "api.foo.lambda"
   *           }
   *         }
   *       }
   *     }
   */
  buildSearchTree() {
    this.__searchTree = {};
    for (let fn in this.__functionDoc) {
      let parts = fn.split(".");
      let tree = this.__searchTree;
      for (let i = parts.length - 1; i >= 0; i--) {
        let part = parts[i];
        if (!tree[part]) {
          tree[part] = {};
        }
        tree = tree[part];
      }
      tree.__value = fn;
    }
  }

  /**
   * parser a markdown documentation text to extract all the functions
   * and their documentation
   * @param {string} content
   */
  parseFunctions(content) {
    this.__functionDoc = {};
    let body = [];
    let fn = "";
    for (let line of content.split("\n")) {
      if (line.startsWith("#")) {
        if (fn) {
          this.__functionDoc[fn] = body.join("\n");
        }

        fn = line.slice(2).trim();
        body = [];
      } else {
        body.push(line);
      }
    }

    if (fn && body.length) {
      this.__functionDoc[fn] = body.join("\n").trim();
    }
  }

  /**
   *
   * @param {number} index
   * @param {import('chevrotain').IToken[]} tokens
   * @param {*} tree
   * @returns {string} the function documentation
   */
  findFunction(index, tokens, tree = null) {
    if (!tree) {
      tree = this.__searchTree;
    }

    const token = tokens[index];
    const node = tree[token.image];

    if (node) {
      const prevToken = tokens[index - 1];
      // if the prev node is a . then we're dealing method of a parent function
      if (prevToken && prevToken.image === ".") {
        return this.findFunction(index - 2, tokens, node);
      }

      if (node.__value) {
        return node.__value;
      }
    }

    return null;
  }

  // eslint-disable-next-line no-unused-vars
  isMatch(index, tokens, parser) {
    const next = tokens[index + 1];
    // if the next token is a . then we're dealing with a method (x.y.z), we'll skip
    // the function documentation until we find the method
    if (next && next.image === ".") {
      return false;
    }

    return !!this.findFunction(index, tokens);
  }

  render(index, tokens) {
    const fn = this.findFunction(index, tokens);

    if (fn) {
      return this.__functionDoc[fn];
    }
  }
}
