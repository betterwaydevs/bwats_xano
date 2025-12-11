export class HoverMessageProvider {
  constructor() {
    this.message = "";
    this.range = null;
  }

  /**
   * checks if the hover message matches the token at the given
   * index
   * @param {number} index
   * @param {import('chevrotain').IToken[]} tokens
   * @param {import('../parser/base_parser.js').XanoBaseParser} parser
   * @returns {boolean} whether the token at the given index matches the hover message
   */
  // eslint-disable-next-line no-unused-vars
  isMatch(index, tokens, parser) {
    return false;
  }

  /**
   * renders the hover message
   * @param {number} index
   * @param {import('chevrotain').IToken[]} tokens
   * @param {import('../parser/base_parser').XanoBaseParser} parser
   * @returns {string}
   */
  // eslint-disable-next-line no-unused-vars
  render(index, tokens, parser) {
    return this.message;
  }
}
