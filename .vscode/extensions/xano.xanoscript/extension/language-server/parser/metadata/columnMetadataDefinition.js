import { EqualToken, LCurly, RCurly } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { TableToken } from "../../lexer/table.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function columnMetadataDefinition($) {
  return () => {
    $.sectionStack.push("columnMetadataDefinition");
    $.CONSUME(LCurly); // "{"
    $.AT_LEAST_ONE(() => {
      $.CONSUME(NewlineToken);
      $.OR([
        { ALT: () => $.SUBRULE($.sensitiveFieldAttribute) },
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        {
          ALT: () => {
            $.CONSUME(TableToken); // "table"
            $.CONSUME(EqualToken); // "="
            $.CONSUME(StringLiteral); // "table name"
          },
        },
      ]);
    });
    $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // Require at least one new line after {
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
