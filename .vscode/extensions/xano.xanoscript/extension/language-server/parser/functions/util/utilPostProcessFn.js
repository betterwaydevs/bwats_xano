import { LCurly, RCurly } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";
import { PostProcessToken } from "../../../lexer/util.js";

/**
 * util.post_process {
 *   stack {
 *     util.get_env as $x3
 *   }
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilPostProcessFn($) {
  return () => {
    let hasStack = false;

    $.sectionStack.push("utilPostProcessFn");
    $.CONSUME(PostProcessToken); // "post_process"
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR([
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
        {
          ALT: () => {
            hasStack = true;
            $.SUBRULE($.stackClause);
          },
        },
      ]);
    });

    if (!hasStack) {
      $.SUBRULE($.stackClause);
    }

    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"

    $.sectionStack.pop();
  };
}
