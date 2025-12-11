import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { MultiLineStringToken } from "../../lexer/multiline.js";
import { DescriptionToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function descriptionFieldAttribute($) {
  return () => {
    $.sectionStack.push("descriptionFieldAttribute");
    $.CONSUME(DescriptionToken); // "description"
    $.CONSUME(EqualToken); // "="
    $.OR([
      {
        ALT: () => $.CONSUME(StringLiteral), // e.g., "A description of the field"
      },
      {
        ALT: () => $.CONSUME(MultiLineStringToken), // e.g., "fieldDescription"
      },
    ]);
    $.sectionStack.pop();
  };
}
