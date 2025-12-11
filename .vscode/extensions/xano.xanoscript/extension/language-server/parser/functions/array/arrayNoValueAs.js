import { AsToken, LCurly, RCurly } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * {
 *   description = ""
 *   disabled = true
 * } as $variable_6
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayNoValueAs($) {
  return () => {
    $.sectionStack.push("arrayNoValueAs");
    $.OPTION(() => {
      $.CONSUME(LCurly);
      $.MANY(() => {
        $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
        $.OR([
          { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
          { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
        ]);
      });

      $.OPTION1(() => $.CONSUME1(NewlineToken));
      $.CONSUME(RCurly);
    });
    $.CONSUME(AsToken);
    $.SUBRULE($.variableOnly);
    $.sectionStack.pop();
  };
}
