import { IfToken, LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

// ($my_array) if (`$this == 3`) {
//  disabled = true
//  description = "Some description goes here too"
// } as x3
/**
 *
 * @param {import('../../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function arrayValueIfAs($) {
  return (parentToken, schema = {}) => {
    $.sectionStack.push("arrayValueIfAs");
    let hasIf = false;

    $.CONSUME(LParent);
    $.MANY(() => $.CONSUME(NewlineToken));
    $.SUBRULE($.expressionFn);
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RParent);

    $.OPTION(() => {
      hasIf = true;
      $.CONSUME(IfToken);
      $.CONSUME1(LParent);
      $.SUBRULE1($.expressionFn);
      $.CONSUME1(RParent);
    });

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parentToken,
        {
          "description?": "[string]",
          "disabled?": "[boolean]",
          ...schema,
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [parentToken] });

    if (!hasIf) {
      $.addWarning("`if (...)` conditional statement is missing", parentToken);
    }

    $.sectionStack.pop();
  };
}
