import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * {
 *   value = ""
 * } as x6
 * To be used when the body of a function only requires a value field
 * and can be disabled and have an optional description.
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function requiredValueFnBody($) {
  return () => {
    $.sectionStack.push("requiredValueFnBody");
    let hasValue = false;

    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR2([
        {
          ALT: () => {
            hasValue = true;
            $.SUBRULE($.valueFieldAttribute);
          },
        },
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
      ]);
    });

    if (!hasValue) {
      $.SUBRULE($.valueFieldAttribute);
    }

    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
