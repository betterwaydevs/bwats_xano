import { GroupToken, LCurly, RCurly } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * group {
 *   stack {
 *     util.get_env as $x3
 *   }
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function groupFn($) {
  return () => {
    let hasStack = false;

    $.sectionStack.push("groupFn");
    $.CONSUME(GroupToken); // "group"
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
