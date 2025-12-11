import { createUniqToken } from "./utils.js";

// captures `...` for xano expressions
export const ExpressionLiteral = createUniqToken({
  name: "ExpressionLiteral",
  label: "`...`",
  pattern: /`([^`\\]|\\.)*`/,
}); // Backtick-quoted template literals

// captures "..."
export const StringLiteral = createUniqToken({
  name: "StringLiteral",
  label: '"..."',
  pattern: /"([^"\\]|\\.)*"/,
});

// captures '...'
export const SingleQuotedStringLiteral = createUniqToken({
  name: "SingleQuotedStringLiteral",
  pattern: /'([^'\\]|\\.)*'/,
  label: "''",
});

export const FloatLiteral = createUniqToken({
  name: "FloatLiteral",
  label: "floating point number",
  pattern: /-?\d+\.\d+/,
});

export const IntegerLiteral = createUniqToken({
  name: "IntegerLiteral",
  label: "integer",
  pattern: /-?\d+/,
  longer_alt: FloatLiteral,
});

export const DoubleDollar = createUniqToken({
  name: "DoubleDollar",
  label: "$$",
  pattern: /\$\$/,
});

export const TimestampLiteralToken = createUniqToken({
  name: "TimestampLiteral",
  pattern:
    /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s([01]\d|2[0-3]):([0-5]\d):([0-5]\d)[+-]\d{4}/,
});

export const LiteralTokens = [
  TimestampLiteralToken,
  ExpressionLiteral,
  StringLiteral,
  SingleQuotedStringLiteral,
  FloatLiteral,
  IntegerLiteral,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ExpressionLiteral.name:
      return "macro";
    case StringLiteral.name:
    case TimestampLiteralToken.name:
      return "doubleString";
    case SingleQuotedStringLiteral.name:
      return "singleString";
    case IntegerLiteral.name:
    case FloatLiteral.name:
      return "number";
    default:
      return null;
  }
}
