import { EqualToken } from "../../lexer/control.js";
import { ValueToken } from "../../lexer/tokens.js";

/**
 * Defines a value to be an expression
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function valueFieldAttribute($) {
  return () => {
    $.sectionStack.push("valueFieldAttribute");
    const parent = $.CONSUME(ValueToken); // "value"
    $.CONSUME(EqualToken); // "="
    // TODO: We'll likely want to also block $var references
    $.SUBRULE($.expressionFn, { ARGS: [parent, { allowIdentifier: false }] }); // e.g., "A value of the field"
    $.sectionStack.pop();
  };
}
