import { every, isArray } from "lodash-es";
import { Identifier } from "../../../lexer/identifier.js";
import {
  FloatLiteral,
  IntegerLiteral,
  SingleQuotedStringLiteral,
  StringLiteral,
  TimestampLiteralToken,
} from "../../../lexer/literal.js";
import { MultiLineStringToken } from "../../../lexer/multiline.js";
import { NullToken } from "../../../lexer/tokens.js";
import { isOptionalAttribute, isSchemaGenericType } from "./utils.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function schemaParseImmutableFn($) {
  return (token, schema, captured = {}) => {
    let attributeCapturedType;
    const capturedValue = $.OR({
      DEF: [
        {
          ALT: () => {
            attributeCapturedType = "string";
            return $.CONSUME(StringLiteral); // e.g., "A instructions of the field"
          },
        },
        {
          ALT: () => {
            attributeCapturedType = "string";
            return $.CONSUME(SingleQuotedStringLiteral); // e.g., 'field\ninstructions\n'
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
            attributeCapturedType = "number";
            return $.CONSUME(FloatLiteral); // e.g., 42.54
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
            attributeCapturedType = "boolean";
            $.SUBRULE($.booleanValue); // e.g., true | false
          },
        },
        {
          ALT: () => {
            attributeCapturedType = "timestamp";
            return $.CONSUME(TimestampLiteralToken); // e.g., 2024-01-01 12:00:00+0000
          },
        },
        {
          ALT: () => {
            attributeCapturedType = "null";
            return $.CONSUME(NullToken); // e.g., null
          },
        },
        { ALT: () => false },
      ],
    });

    $.OPTION({
      GATE: () => !capturedValue,
      DEF: () => {
        $.addExpectedValueTypeError(
          attributeCapturedType,
          `invalid immutable value`
        );
        $.CONSUME(Identifier);
      },
    });

    captured.value = capturedValue;

    $.ACTION(() => {
      const isEnum = isArray(schema);
      const attributeType = isEnum
        ? schema.map(getImmutableAttributeType)
        : getImmutableAttributeType(schema);

      if (isEnum) {
        if (!every(attributeType)) {
          throw new Error(
            `schemaParseImmutableFn called with invalid enum attribute: ${schema}`
          );
        }

        if (!attributeType.includes(attributeCapturedType)) {
          $.addExpectedValueTypeError(token, attributeType.join(" or "));
        }
      } else {
        if (!attributeType) {
          throw new Error(
            `schemaParseImmutableFn called with invalid attribute: ${schema}`
          );
        }
        if (attributeCapturedType !== attributeType) {
          $.addExpectedValueTypeError(token, attributeType);
        }
      }
    });
  };
}

/**
 * If an attribute is typed, return the type
 * @param {string} attr
 * @returns {string|null}
 */
function getImmutableAttributeType(attr) {
  const validTypes = ["string", "number", "boolean", "timestamp", "null"];
  if (isSchemaGenericType(attr)) {
    // remove the brackets and optional marker if present
    const typeName = isOptionalAttribute(attr)
      ? attr.slice(1, -2)
      : attr.slice(1, -1);
    if (validTypes.includes(typeName)) {
      return typeName;
    }
  }
  return null;
}
