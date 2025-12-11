import { EqualToken } from "../../lexer/control.js";
import { DisabledToken, FalseToken, TrueToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function disabledFieldAttribute($) {
  return () => {
    $.sectionStack.push("disabledFieldAttribute");
    $.CONSUME(DisabledToken); // "disabled"
    $.CONSUME(EqualToken); // "="
    $.OR([
      { ALT: () => $.CONSUME(TrueToken) }, // e.g., true,
      { ALT: () => $.CONSUME(FalseToken) }, // e.g., false
    ]);
    $.sectionStack.pop();
  };
}
