import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function enumColumnMetadataDefinition($) {
  return (parent) => {
    $.sectionStack.push("enumColumnMetadataDefinition");
    $.CONSUME(LCurly); // "{"
    // values = [...] is a required field here
    let hasValues = false;
    let hasDescription = false;
    let hasSensitive = false;

    $.MANY(() => {
      $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // Require at least one new line
      $.OR([
        {
          GATE: () => !hasValues,
          ALT: () => {
            hasValues = true;
            $.SUBRULE($.valuesFieldAttribute);
          },
        },
        {
          GATE: () => !hasDescription,
          ALT: () => $.SUBRULE($.sensitiveFieldAttribute),
        },
        {
          GATE: () => !hasSensitive,
          ALT: () => $.SUBRULE($.descriptionFieldAttribute),
        },
      ]);
    });

    if (!hasValues) {
      $.addMissingError(parent, "{} is missing the values attribute");
    }

    $.AT_LEAST_ONE2(() => $.CONSUME2(NewlineToken)); // Require at least one new line after
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
