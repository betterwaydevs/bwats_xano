import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * To be used when the body of a function is optional and can only
 * be disabled and/or have a description.
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function minimalFnBody($) {
  return () => {
    $.sectionStack.push("minimalFnBody");
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR2([
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
      ]);
    });
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
