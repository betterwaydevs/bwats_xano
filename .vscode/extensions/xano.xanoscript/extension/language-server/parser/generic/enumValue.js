import { StringLiteral } from "../../lexer/literal.js";
import { getVarName } from "./utils.js";

/**
 * A string value parser that matches the provided values
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function enumValue($) {
  return (...args) => {
    const values = args || [];

    const stringToken = $.CONSUME3(StringLiteral);
    const providedValue = getVarName(stringToken);

    // Check if the provided value is in the allowed array
    if (!values.includes(providedValue)) {
      $.addMissingError(
        stringToken, 
        `Invalid value "${providedValue}". Must be one of: ${values.map(v => `"${v}"`).join(", ")}`
      );
    }
  };
}
