import { DotToken, Identifier } from "../../lexer/tokens.js";
import { ErrorVariable } from "../../lexer/variables.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function completeErrorVariable($) {
  const allowedProperties = new Set(["name", "code", "message", "result"]);

  return () => {
    const parent = $.CONSUME(ErrorVariable);

    if (!$.sectionStack.includes("catchFn")) {
      $.addInvalidValueError(
        parent,
        `Invalid use of $error variable outside of a catch block.`
      );
    }

    $.CONSUME(DotToken);
    const property = $.CONSUME(Identifier);

    if (!allowedProperties.has(property.image)) {
      $.addInvalidValueError(
        property,
        `Invalid property '${
          property.image
        }' for $error variable. Allowed properties are: ${Array.from(
          allowedProperties
        ).join(", ")}.`
      );
    }

    $.SUBRULE($.chainedIdentifier);
  };
}
