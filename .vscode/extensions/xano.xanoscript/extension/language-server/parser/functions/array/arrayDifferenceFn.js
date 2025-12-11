import { DifferenceToken } from "../../../lexer/arrays.js";
import { LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * Parses the array_difference function.
 *
 * Example:
 *     array.difference ($my_array) {
 *       value = 5
 *       by = $this.id
 *     } as new_variable
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayDifferenceFn($) {
  return () => {
    $.sectionStack.push("arrayDifferenceFn");
    const parent = $.CONSUME(DifferenceToken); // "difference"
    $.CONSUME(LParent);
    $.SUBRULE($.expressionFn);
    $.OPTION(() => $.CONSUME(NewlineToken));
    $.CONSUME(RParent);
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parent,
        {
          value: "[expression]",
          by: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
