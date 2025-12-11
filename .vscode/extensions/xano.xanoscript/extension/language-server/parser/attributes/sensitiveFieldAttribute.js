import { EqualToken } from "../../lexer/control.js";
import { FalseToken, SensitiveToken, TrueToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const sensitiveFieldAttribute = ($) => () => {
  $.sectionStack.push("sensitiveFieldAttribute");
  $.CONSUME(SensitiveToken); // "sensitive"
  $.CONSUME(EqualToken); // "="
  $.OR([
    { ALT: () => $.CONSUME(TrueToken) }, // "true"
    { ALT: () => $.CONSUME(FalseToken) }, // "false"
  ]);
  $.sectionStack.pop();
};
