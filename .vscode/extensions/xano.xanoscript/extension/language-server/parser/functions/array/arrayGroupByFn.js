import { GroupByToken } from "../../../lexer/arrays.js";
import { LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * Parses the array_group_by function.
 *
 * Example:
 *     array.group_by ($users) {
 *       by = $this.age
 *     } as grouped_variable
 *
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayGroupByFn($) {
  return () => {
    $.sectionStack.push("arrayGroupByFn");
    const parent = $.CONSUME(GroupByToken); // "group_by"
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
