import { LCurly, RCurly } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 *
 * @param {*} $
 * @param {import('../../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function valueAttrOnly($) {
  return (parent) => {
    $.sectionStack.push("valueAttrOnly");
    let hasValue = false;
    let hasDescription = false;
    let hasDisabled = false;

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
        {
          GATE: () => !hasDescription,
          ALT: () => $.SUBRULE($.descriptionFieldAttribute),
        },
        {
          GATE: () => !hasDisabled,
          ALT: () => $.SUBRULE($.disabledFieldAttribute),
        },
      ]);
    });

    // value is required, display error if not defined
    if (!hasValue) {
      $.addMissingError(parent, "{} is missing a stack clause");
    }

    $.OPTION1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly);
    $.sectionStack.pop();
  };
}
