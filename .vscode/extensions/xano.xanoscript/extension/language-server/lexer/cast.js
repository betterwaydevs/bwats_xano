import { createUniqToken } from "./utils.js";

// disabled filter identifier (starts with !)
export const DisabledStatementToken = createUniqToken({
  name: "DisabledStatementToken",
  pattern: /![a-zA-Z][\w.]*/,
});

// "!int"
export const IntCastToken = createUniqToken({
  name: "IntCast",
  pattern: /!int/,
  label: "!int",
});

// "!bool"
export const BoolCastToken = createUniqToken({
  name: "BoolCast",
  pattern: /!bool/,
  label: "!bool",
});

// !array
export const ArrayCastToken = createUniqToken({
  name: "ArrayCast",
  pattern: /!array/,
  label: "!array",
});

// !text
export const TextCastToken = createUniqToken({
  name: "TextCast",
  pattern: /!text/,
  label: "!text",
});

// !expr
export const ExpressionCastToken = createUniqToken({
  name: "ExpressionCast",
  pattern: /!expr/,
  label: "!expr",
});

// !decimal
export const DecimalCastToken = createUniqToken({
  name: "DecimalCast",
  pattern: /!decimal/,
  label: "!decimal",
});

// !object
export const ObjectCastToken = createUniqToken({
  name: "ObjectCast",
  pattern: /!object/,
  label: "!object",
});

// !timestamp
export const TimestampCastToken = createUniqToken({
  name: "TimestampCast",
  pattern: /!timestamp/,
  label: "!timestamp",
});

// disabled filter identifier (starts with !)
export const ExclamationToken = createUniqToken({
  name: "ExclamationToken",
  pattern: /!/,
});

export const CastTokens = [
  IntCastToken,
  ArrayCastToken,
  TextCastToken,
  ExpressionCastToken,
  DecimalCastToken,
  ObjectCastToken,
  TimestampCastToken,
  BoolCastToken,
  ExclamationToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case IntCastToken.name:
    case ArrayCastToken.name:
    case TextCastToken.name:
    case ExpressionCastToken.name:
    case DecimalCastToken.name:
    case ObjectCastToken.name:
    case TimestampCastToken.name:
    case BoolCastToken.name:
      return "type";
    case DisabledStatementToken.name:
      return "comment";
    case ExclamationToken.name:
      return "operator";
    default:
      return null;
  }
}
