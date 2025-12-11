import { isArray, partition } from "lodash-es";
import { isSchemaGenericType } from "./utils.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function schemaParseEnumFn($) {
  return (token, schema, captured = {}) => {
    const [immutables, constants] = partition(schema, isSchemaGenericType);
    $.ACTION(() => {
      if (constants.length > 0 && immutables.length > 0) {
        throw new Error(
          "schemaParseEnumFn does not support mixing constant and immutable types in the same enum, received: " +
            JSON.stringify(schema)
        );
      }
    });

    // the following are exclusive, you can't have a [string] and a "foo" in the same enum
    $.OR({
      IGNORE_AMBIGUITIES: true,
      DEF: [
        {
          GATE: () => constants.length > 0,
          ALT: () =>
            $.SUBRULE($.schemaParseConstantFn, {
              ARGS: [token, constants, captured],
            }),
        },
        {
          GATE: () => immutables.length > 0,
          ALT: () =>
            $.SUBRULE($.schemaParseImmutableFn, {
              ARGS: [token, immutables, captured],
            }),
        },
      ],
    });
  };
}

/**
 *
 * @param {*} attr
 * @returns
 */
export function schemaExpectEnum(attr) {
  if (isArray(attr) && attr.length > 1) {
    return true;
  }
  return false;
}
