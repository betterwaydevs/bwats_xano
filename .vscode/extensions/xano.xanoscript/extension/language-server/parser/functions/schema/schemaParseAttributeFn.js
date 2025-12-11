import { get, isPlainObject, keys, some } from "lodash-es";
import { ExclamationToken } from "../../../lexer/cast.js";
import {
  CommaToken,
  EqualToken,
  LCurly,
  RCurly,
} from "../../../lexer/control.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier, NewlineToken } from "../../../lexer/tokens.js";
import {
  canBeDisabledAttribute,
  isMultiAttribute,
  isOptionalAttribute,
  isSchemaGenericType,
  valueMatchRequirements,
} from "./utils.js";

export function schemaParseAttributeFn($) {
  $.requireRules(_schemaParseAttributeFn);

  return (token, schema, captured = {}) => {
    // attribute can be fully ignored when all the keys are optional
    const isAllOptional = keys(schema).every((k) => isOptionalAttribute(k));

    $.OR([
      {
        GATE: () => isAllOptional,
        ALT: () => {
          $.OPTION(() =>
            $.SUBRULE($._schemaParseAttributeFn, {
              ARGS: [token, schema, captured],
            })
          );
        },
      },
      {
        GATE: () => !isAllOptional,
        ALT: () =>
          $.SUBRULE1($._schemaParseAttributeFn, {
            ARGS: [token, schema, captured],
          }),
      },
    ]);
  };
}

/**
 * Similar to schemaParseObjectFn but for attributes (uses = instead of :)
 * captured object will contain the tokens of the captured keys on the object
 * allowing for better error messages later on
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
function _schemaParseAttributeFn($) {
  return (token, schema, captured = {}) => {
    let needSeparator = false;
    let lastToken = null;

    // grab all the keys, they contain the schema for the keys
    const objectKeys = keys(schema);
    const missingKeys = [...objectKeys];
    const attrNames = [];

    // you cannot have a generic mixed with another generic
    $.ACTION(() => {
      if (
        objectKeys.length > 1 &&
        some(objectKeys, (k) => isSchemaGenericType(k))
      ) {
        throw new Error(
          "schemaParseAttributeFn supports only one generic type when multiple keys are defined"
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
            objectKeyToken = $.CONSUME1(Identifier);
            return objectKeyToken.image;
          },
        },
        {
          ALT: () => {
            const objectKeyToken = $.CONSUME1(StringLiteral);
            return objectKeyToken.image.slice(1, -1);
          },
        },
      ]);

      const subSchemaKey = valueMatchRequirements(keyValue, objectKeys);
      if (!subSchemaKey) {
        $.addInvalidValueError(
          objectKeyToken,
          `The argument '${keyValue}' is not valid in this context`
        );
      } else if (disabledToken && !canBeDisabledAttribute(subSchemaKey)) {
        $.addInvalidValueError(
          disabledToken,
          `The argument '${keyValue}' cannot be disabled`
        );
      }

      if (attrNames.includes(keyValue) && !isMultiAttribute(subSchemaKey)) {
        $.addInvalidValueError(
          objectKeyToken,
          `Duplicate argument '${keyValue}' found`
        );
      } else {
        attrNames.push(keyValue);
        captured[keyValue] = { key: objectKeyToken, value: null };
      }

      // remove from missing keys
      missingKeys.splice(missingKeys.indexOf(subSchemaKey), 1);

      const subSchema = get(schema, subSchemaKey, null);

      const isStack = ["[stack]", "[test-stack]"].includes(subSchema);
      $.OR1([
        {
          GATE: () => !isStack,
          ALT: () => $.CONSUME(EqualToken), // "="
        },
        {
          GATE: () => isStack,
          ALT: () => false,
        },
      ]);

      $.SUBRULE($.schemaFn, {
        ARGS: [objectKeyToken, subSchema, captured[keyValue]],
      });

      needSeparator = true;
      $.MANY2(() => {
        needSeparator = false;
        $.CONSUME1(NewlineToken);
      });

      $.OPTION(() => {
        needSeparator = false;
        $.CONSUME1(CommaToken);
      });
    });
    $.CONSUME(RCurly); // "}"

    if (missingKeys.length) {
      const missingKeyNames = missingKeys.filter(
        (k) => !isOptionalAttribute(k)
      );
      if (missingKeyNames.length > 1) {
        $.addInvalidValueError(
          lastToken || token,
          `The following required arguments are missing: ${missingKeyNames.join(
            ", "
          )}`
        );
      } else if (missingKeyNames.length === 1) {
        $.addInvalidValueError(
          lastToken || token,
          `Missing required argument '${missingKeyNames[0]}'`
        );
      }
    }
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
