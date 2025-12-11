import { EqualToken } from "../../lexer/control.js";
import { ResponseToken } from "../../lexer/tokens.js";

/**
 * response = $entries
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function responseClause($) {
  return () => {
    $.sectionStack.push("responseClause");
    const parent = $.CONSUME(ResponseToken); // "response"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.expressionFn, { ARGS: [parent, { allowDisabledKeys: true }] }); // e.g., { !key: value }
    $.sectionStack.pop();
  };
}
