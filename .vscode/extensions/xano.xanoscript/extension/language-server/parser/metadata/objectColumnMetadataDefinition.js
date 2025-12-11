import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function objectColumnMetadataDefinition($) {
  return () => {
    $.sectionStack.push("objectColumnMetadataDefinition");
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // Require at least one new line after {
      $.OR([
        { ALT: () => $.SUBRULE($.sensitiveFieldAttribute) },
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        {
          ALT: () =>
            $.SUBRULE($.schemaClause, { ARGS: [{ include_file: false }] }),
        },
      ]);
    });
    $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // Require at least one new line after {
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
