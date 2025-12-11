import { EqualToken } from "../../lexer/control.js";
import { ValuesToken } from "../../lexer/tokens.js";

/**
 * for value definitions like
 *   values = ["active", "inactive", "unknown"]
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function valuesFieldAttribute($) {
  return () => {
    $.sectionStack.push("valuesFieldAttribute");
    $.CONSUME(ValuesToken); // "values"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.stringArray); // List of values
    $.sectionStack.pop();
  };
}
