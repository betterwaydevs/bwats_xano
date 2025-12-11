// what are the syntax tokens xanoscript uses?
// see https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers
// for a full list of token types
export const TOKEN_TYPES = [
  "keyword",
  "namespace",
  "variable",
  "singleString",
  "doubleString",
  "tripleString",
  "method",
  "macro",
  "tripleMacro",
  "property",
  "operator",
  "operator.openingCurly",
  "operator.closingCurly",
  "operator.openingSquare",
  "operator.closingSquare",
  "operator.openingParenthesis",
  "operator.closingParenthesis",
  "function",
  "comment",
  "type",
  "punctuation",
  "regexp",
  "enumMember",
  "number",
  "boolean",
  "bracket",
];

const tokenIdx = TOKEN_TYPES.reduce((acc, token, idx) => {
  acc[token] = idx;
  return acc;
}, {});

export function encodeTokenType(type) {
  return tokenIdx[type];
}
