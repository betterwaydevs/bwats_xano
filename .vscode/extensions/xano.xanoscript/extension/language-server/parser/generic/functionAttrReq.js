import { EqualToken, LCurly, RCurly } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { Identifier, NewlineToken } from "../../lexer/tokens.js";
import { getVarName } from "./utils.js";

const DEFAULT_OPTIONS = {
  allowDuplicates: [],
  allowQueryExpression: false,
  allowDisabledKeys: false,
  types: {},
};

/**
 * Dynamicly raises error for missing and required attributes
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function functionAttrReq($) {
  /**
   * @param {import('chevrotain').IToken} parent
   * @param {string[]} required the required attributes
   * @param {string[]} optional the optional attributes
   * @param {Object} options additional options
   * @param {string[]} options.allowDuplicates attributes that are allowed to be duplicated
   * @param {string[]} options.allowQueryExpression special attriutes that will allow query expressions
   **/
  return (parent, required, optional, options = {}) => {
    // setup basic defaults
    required = required || [];
    optional = optional || [];
    let hasAtLeastOneAttribute = false;
    let hasMock = false;

    options = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    const definedAttributes = [];
    const allowedAttributes = [...required, ...optional];

    $.OR({
      IGNORE_AMBIGUITIES: true,

      DEF: [
        {
          GATE: () => required.length === 0,
          ALT: () => {
            // if there is no required attributes, then the curly braces
            // are optional too. e.g: util.get_env as $x3
            $.OPTION(() => {
              $.CONSUME(LCurly); // "{"
              $.MANY(() => {
                $.OR1([
                  {
                    // single line attributes do not require a new line
                    GATE: () => !hasAtLeastOneAttribute,
                    ALT: () => $.MANY1(() => $.CONSUME1(NewlineToken)),
                  },
                  {
                    // over a single attribute, we need a new line
                    GATE: () => hasAtLeastOneAttribute,
                    ALT: () => $.AT_LEAST_ONE(() => $.CONSUME2(NewlineToken)),
                  },
                ]);

                $.OR2([
                  {
                    // Standard attribute: identifier = value
                    ALT: () => {
                      const identifier = $.CONSUME(Identifier);
                      definedAttributes.push(identifier);
                      $.CONSUME(EqualToken); // "="

                      const varName = getVarName(identifier);
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
                        $.OR4({
                          DEF: [
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
                              ALT: () => $.CONSUME1(StringLiteral), // "..."
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
                          ],
                          ERR_MSG: varType
                            ? `${varType} for attribute ${identifier.image}`
                            : undefined,
                        });
                      }

                      hasAtLeastOneAttribute = true;
                    },
                  },
                  {
                    GATE: () => !hasMock,
                    // mock attribute: mock "name" { value = ... }
                    ALT: () => {
                      hasMock = true;
                      $.SUBRULE($.mockAttribute);
                      hasAtLeastOneAttribute = true;
                    },
                  },
                ]);
              });
              $.MANY2(() => $.CONSUME3(NewlineToken));
              $.CONSUME(RCurly); // "}"
            });
          },
        },
        {
          GATE: () => required.length > 0,
          ALT: () => {
            $.CONSUME1(LCurly); // "{"
            $.MANY4(() => {
              $.OR3([
                {
                  // single line attributes do not require a new line
                  GATE: () => !hasAtLeastOneAttribute,
                  ALT: () => $.MANY5(() => $.CONSUME4(NewlineToken)),
                },
                {
                  // over a single attribute, we need a new line
                  GATE: () => hasAtLeastOneAttribute,
                  ALT: () => $.AT_LEAST_ONE1(() => $.CONSUME5(NewlineToken)),
                },
              ]);

              $.OR5([
                {
                  // Standard attribute: identifier = value
                  ALT: () => {
                    const identifier = $.CONSUME1(Identifier);
                    definedAttributes.push(identifier);
                    $.CONSUME1(EqualToken); // "="

                    const varName = getVarName(identifier);
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
                      $.OR6({
                        DEF: [
                          {
                            GATE: () => varType === "boolean",
                            ALT: () => $.SUBRULE2($.booleanValue), // boolean
                          },
                          {
                            GATE: () => varType === "number",
                            ALT: () => $.SUBRULE2($.numberValue), // number
                          },
                          {
                            GATE: () => varType === "string",
                            ALT: () => $.CONSUME2(StringLiteral), // "..."
                          },
                          {
                            GATE: () => varType === "object",
                            ALT: () =>
                              $.SUBRULE2($.objectWithAttributes, {
                                ARGS: [options],
                              }),
                          },
                          {
                            GATE: () => !varType,
                            ALT: () =>
                              $.SUBRULE2($.expressionFn, {
                                ARGS: [identifier, options],
                              }), // anything goes
                          },
                        ],
                        ERR_MSG: varType
                          ? `${varType} for attribute ${identifier.image}`
                          : undefined,
                      });
                    }

                    hasAtLeastOneAttribute = true;
                  },
                },
                {
                  GATE: () => !hasMock,
                  // mock attribute: mock "name" { value = ... }
                  ALT: () => {
                    $.SUBRULE2($.mockAttribute);
                    hasMock = true;
                    hasAtLeastOneAttribute = true;
                  },
                },
              ]);
            });
            $.MANY6(() => $.CONSUME6(NewlineToken));
            $.CONSUME1(RCurly); // "}"
          },
        },
      ],
    });

    // detects duplicate attributes
    const duplicateAttributes = definedAttributes.filter(
      (token, index) =>
        !options.allowDuplicates.includes(token.image) &&
        definedAttributes.findIndex((t) => t.image === token.image) !== index
    );
    for (const token of duplicateAttributes) {
      $.addDuplicateAttributeError(token);
    }

    // report any illegal attributes
    const illegalAttributes = definedAttributes.filter(
      (token) => !allowedAttributes.includes(token.image)
    );
    for (const token of illegalAttributes) {
      $.addIllegalAttributeError(token);
    }

    // report any missing attributes
    const definedAttrNames = definedAttributes.map((token) => token.image);
    const missingAttributes = required.filter(
      (reqAttrName) => !definedAttrNames.includes(reqAttrName)
    );
    if (missingAttributes.length > 0) {
      $.addMissingAttributeError(parent, missingAttributes);
    }

    $.sectionStack.pop();
  };
}
