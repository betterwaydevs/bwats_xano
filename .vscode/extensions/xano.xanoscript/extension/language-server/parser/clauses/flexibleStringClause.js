import { EqualToken } from "../../lexer/control.js";
import { Identifier } from "../../lexer/identifier.js";
import { StringLiteral } from "../../lexer/literal.js";
import { MultiLineStringToken } from "../../lexer/multiline.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function flexibleStringClause($) {
  /**
   * @param {import('chevrotain').TokenType} token
   * @param allowEmpty
   */
  return (args) => {
    // During parser initialization, args is undefined
    // Use a placeholder token for grammar recording
    const token = args?.[0] || Identifier;
    const allowEmpty = args?.[1] ?? true;

    $.sectionStack.push(token.name + "Clause");

    $.CONSUME(token); // "tokenLabel"
    $.CONSUME(EqualToken); // "="

    const result = $.OR([
      {
        ALT: () => $.CONSUME(StringLiteral), // e.g., "A instructions of the field"
      },
      {
        ALT: () => $.CONSUME(MultiLineStringToken), // e.g., "fieldinstructions"
      },
    ]);

    if (!allowEmpty) {
      // Don't allow empty values inside quotes
      if (result.image === `""`) {
        $.addMissingError(result, "value cannot be empty");
      }
    }

    $.sectionStack.pop();
  };
}
