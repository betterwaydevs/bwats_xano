import { isArray, some } from "lodash-es";
import {
  FloatLiteral,
  IntegerLiteral,
  SingleQuotedStringLiteral,
  StringLiteral,
} from "../../../lexer/literal.js";
import { MultiLineStringToken } from "../../../lexer/multiline.js";
import { FalseToken, NullToken, TrueToken } from "../../../lexer/tokens.js";
import { isSchemaGenericType } from "./utils.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function schemaParseConstantFn($) {
  return (token, schema, captured = {}) => {
    let attributeCapturedType = null;

    const capturedValue = $.OR([
      {
        ALT: () => {
          attributeCapturedType = "string";
          return $.CONSUME(StringLiteral); // e.g., "A instructions of the field"
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "string";
          return $.CONSUME(MultiLineStringToken); // e.g., """field\ninstructions\n"""
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "string";
          return $.CONSUME(SingleQuotedStringLiteral); // e.g., 'field instructions'
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "number";
          return $.CONSUME(IntegerLiteral); // e.g., 42
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "number";
          return $.CONSUME(FloatLiteral); // e.g., 42.54
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "boolean";
          return $.CONSUME(TrueToken); // e.g., true
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "boolean";
          return $.CONSUME(FalseToken); // e.g., false
        },
      },
      {
        ALT: () => {
          attributeCapturedType = "null";
          return $.CONSUME(NullToken); // e.g., null
        },
      },
    ]);

    captured.value = capturedValue;

    $.ACTION(() => {
      const isMatch = matchValueToSchema(
        attributeCapturedType,
        capturedValue.image,
        schema
      );

      if (!isMatch) {
        $.addExpectedValueError(token, schema);
      }
    });
  };
}

function matchValueToSchema(attributeCapturedType, value, schema) {
  const schemaValue = schema !== null ? schema.toString() : schema;

  // schema can be an array of type/values required
  if (isArray(schema)) {
    return some(schema, (s) =>
      matchValueToSchema(attributeCapturedType, value, s)
    );
  }

  switch (attributeCapturedType) {
    case "string":
      // remove the quotes for easier comparison
      if (value.startsWith('"""') || value.startsWith("'''")) {
        value = value.slice(4, -4).trim();
      }
      if (value.startsWith('"') || value.startsWith("'")) {
        value = value.slice(1, -1);
      }

      return value === schemaValue;

    case "number":
    case "boolean":
      return value === schemaValue;
    case "null":
      return schemaValue === null;
    default:
      throw new Error(
        `schemaParseConstantFn called with non-constant attribute: ${schema}`
      );
  }
}

/**
 * Check if an argument is a constant as opposed to a type, a constant has an expected value
 * @param {*} attr
 * @returns
 */
export function schemaExpectConstant(attr) {
  if (isSchemaGenericType(attr)) return false;
  return (
    typeof attr === "string" ||
    typeof attr === "number" ||
    typeof attr === "boolean" ||
    attr === null
  );
}
