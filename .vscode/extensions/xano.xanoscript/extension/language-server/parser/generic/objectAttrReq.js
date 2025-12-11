import { MismatchedTokenException } from "chevrotain";
import { ColonToken, CommaToken, LCurly, RCurly } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { MultiLineStringToken } from "../../lexer/multiline.js";
import { Identifier, NewlineToken } from "../../lexer/tokens.js";
import { getVarName } from "./utils.js";

const DEFAULT_OPTIONS = {
  allowDuplicates: [],
  allowQueryExpression: false,
  recursive: [],
  recursiveArray: [],
  allowVariables: true,
  types: {},
};

/**
 * Dynamicly raises error for missing and required attributes
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function objectAttrReq($) {
  /**
   * @param {import('chevrotain').IToken} parent
   * @param {string[]} required the required attributes
   * @param {string[]} optional the optional attributes
   * @param {Object} options additional options
   * @param {string[]} options.allowDuplicates attributes that are allowed to be duplicated
   * @param {string[]} options.allowQueryExpression attributes that are allowed to be duplicated
   * @param {string[]} options.recursive the same rules applies to sub-objects deeper in the tree
   * @param {string[]} options.recursiveArray the same rules applies to sub-arrays deeper in the tree
   * @param {boolean} options.allowVariables whether to allow variables as values
   * @param {Object} options.types a map of attribute names to their expected types (string, number, boolean)
   *                                 if the type is not specified, any value is allowed
   **/
  return (parent, required, optional, options = {}) => {
    // setup basic defaults
    required = required || [];
    optional = optional || [];

    options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    const definedAttributes = [];
    const allowedAttributes = [...required, ...optional];
    let identifier;

    $.CONSUME(LCurly); // "{"
    $.OPTION(() => {
      $.OR([
        {
          // one line, comma separated { key: value, key2: value2 }
          ALT: () => {
            $.AT_LEAST_ONE_SEP({
              SEP: CommaToken,
              DEF: () => {
                identifier = $.OR1([
                  { ALT: () => $.CONSUME(Identifier) }, // key
                  { ALT: () => $.CONSUME(StringLiteral) }, // "value"
                ]);
                definedAttributes.push(identifier);
                const varName = getVarName(identifier);
                $.CONSUME(ColonToken);
                if (options.recursive.includes(varName)) {
                  $.SUBRULE($.objectAttrReq, {
                    ARGS: [identifier, required, optional, options],
                  });
                } else if (options.recursiveArray.includes(varName)) {
                  $.SUBRULE($.arrayOfObjectAttrReq, {
                    ARGS: [identifier, required, optional, options],
                  });
                } else {
                  const varType = options.types[varName];
                  if (typeof varType === "function") {
                    varType.call(null, $, identifier); // custom function handler
                  } else if (Array.isArray(varType)) {
                    // Treat array as enum - value must be one of the array elements
                    const stringToken = $.CONSUME3(StringLiteral);
                    const providedValue = getVarName(stringToken);

                    // Check if the provided value is in the allowed array
                    if (!varType.includes(providedValue)) {
                      $.addMissingError(
                        stringToken,
                        `Invalid value "${providedValue}". Must be one of: ${varType
                          .map((v) => `"${v}"`)
                          .join(", ")}`
                      );
                    }
                  } else {
                    $.OR4([
                      {
                        GATE: () => varType === "boolean",
                        ALT: () => $.SUBRULE($.booleanValue), // boolean
                      },
                      {
                        GATE: () => varType === "number",
                        ALT: () => $.SUBRULE($.numberValue), // number
                      },
                      {
                        GATE: () => varType === "string",
                        ALT: () => $.CONSUME3(StringLiteral), // "..."
                      },
                      {
                        GATE: () => varType === "object",
                        ALT: () =>
                          $.SUBRULE1($.objectWithAttributes, {
                            ARGS: [options],
                          }),
                      },
                      {
                        GATE: () => !varType,
                        ALT: () =>
                          $.SUBRULE($.expressionFn, {
                            ARGS: [identifier, options],
                          }), // anything goes
                      },
                    ]);
                  }
                }
              },
            });
          },
        },
        {
          // multi line, each key value pair on a new line
          // {
          //   key: value
          //   key2: value2
          // }
          ALT: () => {
            $.CONSUME(NewlineToken);
            $.AT_LEAST_ONE(() => {
              const identifier = $.OR2([
                { ALT: () => $.CONSUME2(Identifier) }, // key
                { ALT: () => $.CONSUME2(StringLiteral) }, // "other key"
              ]);
              definedAttributes.push(identifier);
              $.CONSUME1(ColonToken);
              const varName = getVarName(identifier);
              if (options.recursive.includes(varName)) {
                $.SUBRULE($.objectAttrReq, {
                  ARGS: [identifier, required, optional, options],
                });
              } else if (options.recursiveArray.includes(varName)) {
                $.SUBRULE($.arrayOfObjectAttrReq, {
                  ARGS: [identifier, required, optional, options],
                });
              } else {
                const varType = options.types[varName];
                if (typeof varType === "function") {
                  varType.call(null, $, identifier); // custom function handler
                } else if (Array.isArray(varType)) {
                  // Treat array as enum - value must be one of the array elements
                  const stringToken = $.CONSUME3(StringLiteral);
                  const providedValue = getVarName(stringToken);

                  // Check if the provided value is in the allowed array
                  if (!varType.includes(providedValue)) {
                    $.SAVE_ERROR(
                      new MismatchedTokenException(
                        `Invalid value "${providedValue}". Must be one of: ${varType
                          .map((v) => `"${v}"`)
                          .join(", ")}`,
                        stringToken,
                        stringToken
                      )
                    );
                  }
                } else {
                  $.OR3([
                    {
                      GATE: () => varType === "boolean",
                      ALT: () => $.SUBRULE1($.booleanValue), // boolean
                    },
                    {
                      GATE: () => varType === "number",
                      ALT: () => $.SUBRULE1($.numberValue), // number
                    },
                    {
                      GATE: () => varType === "string",
                      ALT: () =>
                        $.OR5([
                          { ALT: () => $.CONSUME1(StringLiteral) }, // "..."
                          { ALT: () => $.CONSUME(MultiLineStringToken) },
                        ]),
                    },
                    {
                      GATE: () => varType === "object",
                      ALT: () =>
                        $.SUBRULE($.objectWithAttributes, { ARGS: [options] }),
                    },
                    {
                      GATE: () => !varType,
                      ALT: () =>
                        $.SUBRULE1($.expressionFn, {
                          ARGS: [identifier, options],
                        }), // anything goes
                    },
                  ]);
                }
              }
              $.OPTION1(() => $.CONSUME(CommaToken)); // ","
              $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken));
            });
          },
        },
      ]);
    });
    $.CONSUME(RCurly); // "}"

    // detects duplicate attributes
    const duplicateAttributes = definedAttributes.filter(
      (token, index) =>
        !options.allowDuplicates.includes(getVarName(token)) &&
        definedAttributes.findIndex(
          (t) => getVarName(t) === getVarName(token)
        ) !== index
    );

    for (const token of duplicateAttributes) {
      $.addDuplicateAttributeError(token);
    }

    // report any illegal attributes
    const illegalAttributes = definedAttributes.filter(
      (token) => !allowedAttributes.includes(getVarName(token))
    );
    for (const token of illegalAttributes) {
      $.addIllegalAttributeError(token);
    }

    // report any missing attributes
    const definedAttrNames = definedAttributes.map(getVarName);
    const missingAttributes = required.filter(
      (reqAttrName) => !definedAttrNames.includes(reqAttrName)
    );
    if (missingAttributes.length > 0) {
      $.addMissingAttributeError(parent, missingAttributes);
    }
  };
}
