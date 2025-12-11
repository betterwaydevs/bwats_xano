import { isArray } from "lodash-es";
import { schemaExpectArray } from "./schemaParseArrayFn.js";
import { schemaExpectConstant } from "./schemaParseConstantFn.js";
import { schemaExpectEnum } from "./schemaParseEnum.js";
import { schemaExpectObject } from "./schemaParseObjectFn.js";
import { schemaExpectOneOf } from "./utils.js";

const getErrorMessageForSchema = (schema) => {
  if (
    schemaExpectOneOf(schema, [
      "string",
      "number",
      "boolean",
      "timestamp",
      "null",
    ])
  ) {
    if (isArray(schema)) {
      return `Expected one of the following types:  ${schema.join(", ")}`;
    } else {
      return `Expected a ${schema}`;
    }
  } else if (schemaExpectConstant(schema)) {
    if (isArray(schema)) {
      return `Expected one of the following constants: ${schema.join(", ")}`;
    } else {
      return `Expected a ${schema}`;
    }
  } else if (schemaExpectArray(schema)) {
    return `Expected an array of ${schema[0]}`;
  } else if (schemaExpectObject(schema)) {
    return `Expected an object {}`;
  } else if (schemaExpectEnum(schema)) {
    return `Expected one of the following enum values: ${schema.join(", ")}`;
  } else if (schemaExpectOneOf(schema, ["mock"])) {
    return `Expected a mock`;
  } else if (schemaExpectOneOf(schema, ["expression"])) {
    return `Expected an expression`;
  } else if (schemaExpectOneOf(schema, ["query"])) {
    return `Expected a database query expression`;
  } else if (schemaExpectOneOf(schema, ["stack"])) {
    return `Expected a stack definition`;
  } else {
    return `Invalid schema: received ${JSON.stringify(schema)}`;
  }
};

/**
 * Parses input based on a schema definition
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function schemaFn($) {
  return (token, schema, captured = {}) => {
    $.sectionStack.push("schema");

    $.OR({
      ERR_MSG: getErrorMessageForSchema(schema),
      DEF: [
        {
          GATE: () =>
            schemaExpectOneOf(
              schema,
              ["string", "number", "boolean", "timestamp"],
              captured
            ),
          ALT: () => {
            $.SUBRULE($.schemaParseImmutableFn, {
              ARGS: [token, schema, captured],
            });
            return true;
          },
        },
        {
          GATE: () => schemaExpectConstant(schema),
          ALT: () => {
            $.SUBRULE($.schemaParseConstantFn, {
              ARGS: [token, schema, captured],
            });
            return true;
          },
        },
        {
          GATE: () => schemaExpectArray(schema),
          ALT: () => {
            $.SUBRULE($.schemaParseArrayFn, {
              ARGS: [token, schema, captured],
            });
            return true;
          },
        },
        {
          GATE: () => schemaExpectObject(schema),
          ALT: () => {
            $.SUBRULE($.schemaParseObjectFn, {
              ARGS: [token, schema, captured],
            });
            return true;
          },
        },
        {
          GATE: () => schemaExpectEnum(schema),
          ALT: () => {
            $.SUBRULE($.schemaParseEnumFn, { ARGS: [token, schema, captured] });
            return true;
          },
        },
        {
          // FIXME: this is slowing down parsing significantly
          // handles "[expression]" and "[query]" types
          GATE: () =>
            schemaExpectOneOf(schema, [
              "expression",
              "query",
              "stack",
              "test-stack",
            ]),
          ALT: () => {
            $.OR1([
              {
                GATE: () => schemaExpectOneOf(schema, ["stack", "test-stack"]),
                ALT: () => {
                  const isTest = schemaExpectOneOf(schema, ["test-stack"]);
                  $.SUBRULE($.nakedStackFn, {
                    ARGS: [
                      {
                        allowExpectStatements: isTest,
                        allowCallStatements: isTest,
                      },
                    ],
                  });
                },
              },
              {
                GATE: () => schemaExpectOneOf(schema, ["expression", "query"]),
                ALT: () => {
                  // a different set of filters is allowed on query expressions
                  const isQuery = schemaExpectOneOf(schema, ["query"]);
                  $.SUBRULE($.expressionFn, {
                    ARGS: [
                      token,
                      {
                        allowQueryExpression: isQuery,
                      },
                    ],
                  }); // e.g., $foo.test
                },
              },
            ]);
          },
        },
      ],
    });

    $.sectionStack.pop();
  };
}
