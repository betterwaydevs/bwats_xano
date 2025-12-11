import { EqualToken } from "../../lexer/control.js";
import { AuthToken, FalseToken, TrueToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export const authClause = ($) => () => {
  $.sectionStack.push("authClause");
  $.CONSUME(AuthToken); // "auth"
  $.CONSUME(EqualToken); // "="
  $.OR([
    { ALT: () => $.CONSUME(TrueToken) }, // "true"
    { ALT: () => $.CONSUME(FalseToken) }, // "false"
  ]);
  $.sectionStack.pop();
};
