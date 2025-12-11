import { EqualToken } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { MultiLineStringToken } from "../../lexer/multiline.js";
import { DocsToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function docsFieldAttribute($) {
  return () => {
    $.sectionStack.push("docsFieldAttribute");
    $.CONSUME(DocsToken); // "docs"
    $.CONSUME(EqualToken); // "="
    $.OR([
      {
        ALT: () => $.CONSUME(StringLiteral), // e.g., "A docs of the field"
      },
      {
        ALT: () => $.CONSUME(MultiLineStringToken), // e.g., "fieldDocs"
      },
    ]);
    $.sectionStack.pop();
  };
}
