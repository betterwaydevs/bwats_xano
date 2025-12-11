import { DefaultToken } from "../../../lexer/control.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function switchDefaultFn($) {
  return () => {
    $.sectionStack.push("switchDefaultFn");
    $.CONSUME(DefaultToken); // "default"
    $.SUBRULE($.nakedStackFn);
    $.sectionStack.pop();
  };
}
