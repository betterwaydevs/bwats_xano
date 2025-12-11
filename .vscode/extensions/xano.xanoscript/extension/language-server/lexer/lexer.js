import { Lexer } from "chevrotain";
import { without } from "lodash-es";
import { DisabledStatementToken, ExclamationToken } from "./cast.js";
import { allTokens } from "./tokens.js";

export const lexer = new Lexer(allTokens);
// for the DisabledStatementToken to work, we need to remove the ExclamationToken from the lexer
// otherwise the '!' will always be matched first
// The parser will never use this lexer, it's only for highlighting (displaying disabled statements in a different color)
export const lexerWithDisabled = new Lexer([
  ...without(allTokens, ExclamationToken),
  DisabledStatementToken,
]);

/**
 * To be use for testing purposes, the lexer should be invoked with the input text
 * from the parser.
 *
 * @param {string} inputText
 * @returns {import('chevrotain').ILexingResult}
 */
export function lexDocument(inputText, disabled = false) {
  return disabled
    ? lexerWithDisabled.tokenize(inputText)
    : lexer.tokenize(inputText);
}
