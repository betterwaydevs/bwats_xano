import { UnionToken } from "../../../lexer/arrays.js";
import { LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * Parses the array_union function.
 *
 * Example:
 *     array.union ($my_array) {
 *       value = 5
 *       by = $this.id
 *     } as new_variable
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayUnionFn($) {
  return () => {
    $.sectionStack.push("arrayUnionFn");
    const parent = $.CONSUME(UnionToken); // "union"
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
