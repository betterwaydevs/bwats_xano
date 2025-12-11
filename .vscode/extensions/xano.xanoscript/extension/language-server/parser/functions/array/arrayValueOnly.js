import { LCurly, RCurly } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

// {
//   value = 12
//   disabled = true
//   description = "Some description goes here too"
// }
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayValueOnly($) {
  return () => {
    $.sectionStack.push("arrayValueOnly");
    let hasValue = false;
    $.CONSUME(LCurly);
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR([
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

    // value is required, display error if not defined
    if (!hasValue) {
      $.SUBRULE($.valueFieldAttribute);
    }

    $.OPTION1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly);
    $.sectionStack.pop();
  };
}
