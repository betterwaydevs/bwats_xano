import { StringLiteral } from "../../lexer/literal.js";

/**
 * capture the name of the variable from string literals
 * @param {import('chevrotain').IToken} token
 * @returns
 */
export const getVarName = (token) => {
  if (!token) return "";
  if (token.tokenType === StringLiteral) {
    return token.image.slice(1, -1); // remove quotes
  }
  return token.image;
};
