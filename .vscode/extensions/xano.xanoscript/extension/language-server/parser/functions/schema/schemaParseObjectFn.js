import { get, isPlainObject, keys, some } from "lodash-es";
import { ExclamationToken } from "../../../lexer/cast.js";
import {
  ColonToken,
  CommaToken,
  LCurly,
  RCurly,
} from "../../../lexer/control.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { DotToken, Identifier, NewlineToken } from "../../../lexer/tokens.js";
import {
  canBeDisabledAttribute,
  isMultiAttribute,
  isOptionalAttribute,
  isSchemaGenericType,
  valueMatchRequirements,
} from "./utils.js";

/**
 * Parse an object schema, set isAttribute to true if parsing an attribute
 * object (uses = instead of :)
 * captured will contain the tokens of the captured keys on the object
 * allowing for better error messages later on
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function schemaParseObjectFn($) {
  return (token, schema, captured = {}) => {
    let needSeparator = false;
    let lastToken = null;

    // grab all the keys, they contain the schema for the keys
    const objectKeys = keys(schema);
    const missingKeys = [...objectKeys];
    const keyNames = [];

    // you cannot have a generic mixed with another generic
    $.ACTION(() => {
      if (
        objectKeys.length > 1 &&
        some(objectKeys, (k) => isSchemaGenericType(k))
      ) {
        throw new Error(
          "schemaParseObjectFn supports only one generic type when multiple keys are defined"
        );
      }
    });

    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.MANY1(() => {
        needSeparator = false;
        $.CONSUME(NewlineToken);
      });

      if (needSeparator) {
        $.addInvalidValueError(
          lastToken,
          "Expected a comma, a new line or closing bracket"
        );
      }

      const disabledToken = $.OPTION1(() => $.CONSUME(ExclamationToken)); // "!"

      // first we capture the key
      let objectKeyToken;
      const keyValue = $.OR([
        {
          ALT: () => {
            objectKeyToken = $.CONSUME(Identifier);
            const tokens = [objectKeyToken];
            $.MANY3(() => {
              tokens.push($.CONSUME(DotToken));
              tokens.push($.CONSUME1(Identifier));
            });
            const fullKey = tokens.map((t) => t.image).join(".");
            return fullKey;
          },
        },
        {
          ALT: () => {
            const objectKeyToken = $.CONSUME(StringLiteral);
            return objectKeyToken.image.slice(1, -1);
          },
        },
      ]);

      const subSchemaKey = valueMatchRequirements(keyValue, objectKeys);
      if (!subSchemaKey) {
        $.addInvalidValueError(
          objectKeyToken,
          `The key '${keyValue}' is not valid in this context`
        );
      } else if (disabledToken && !canBeDisabledAttribute(subSchemaKey)) {
        $.addInvalidValueError(
          disabledToken,
          `The key '${keyValue}' cannot be disabled`
        );
      }

      if (keyNames.includes(keyValue) && !isMultiAttribute(subSchemaKey)) {
        $.addInvalidValueError(
          objectKeyToken,
          `Duplicate key '${keyValue}' found`
        );
      } else {
        keyNames.push(keyValue);
        captured[keyValue] = { key: objectKeyToken, value: null };
      }

      // remove from missing keys
      missingKeys.splice(missingKeys.indexOf(subSchemaKey), 1);

      $.CONSUME(ColonToken); // ":"

      const subSchema = get(schema, subSchemaKey, null);

      $.SUBRULE($.schemaFn, {
        ARGS: [objectKeyToken, subSchema, captured[keyValue]],
      });

      needSeparator = true;
      $.OPTION(() => {
        needSeparator = false;
        $.CONSUME1(CommaToken);
      });

      $.MANY2(() => {
        needSeparator = false;
        $.CONSUME1(NewlineToken);
      });
    });
    $.CONSUME(RCurly); // "}"

    if (missingKeys.length) {
      const missingKeyNames = missingKeys.filter(
        (k) => !isOptionalAttribute(k)
      );
      if (missingKeyNames.length > 1) {
        $.addMissingError(
          lastToken || token,
          `{} is missing the following required entries: ${missingKeyNames.join(
            ", "
          )}`
        );
      } else if (missingKeyNames.length === 1) {
        if (isSchemaGenericType(missingKeyNames[0])) {
          $.addMissingError(
            lastToken || token,
            `{} requires a least one entry`
          );
        } else {
          $.addMissingError(
            lastToken || token,
            `{} is missing required key '${missingKeyNames[0]}'`
          );
        }
      }
    }

    return { foo: "foo-bar" };
  };
}

/**
 *
 * @param {*} attr
 * @returns
 */
export function schemaExpectObject(attr) {
  return isPlainObject(attr);
}
