import { MapToken } from "../../../lexer/arrays.js";
import { LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * Parses the array_map function.
 *
 * Example:
 *     array.map ($my_array) {
 *       by = $this.id
 *     } as mapped_variable
 *
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayMapFn($) {
  return () => {
    $.sectionStack.push("arrayMapFn");
    const parent = $.CONSUME(MapToken); // "map"
    $.CONSUME(LParent);
    $.SUBRULE($.expressionFn);
    $.OPTION(() => $.CONSUME(NewlineToken));
    $.CONSUME(RParent);
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parent,
        {
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
