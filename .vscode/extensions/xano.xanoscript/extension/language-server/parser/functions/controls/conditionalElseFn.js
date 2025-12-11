import { ElseToken } from "../../../lexer/control.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function conditionalElseFn($) {
  return () => {
    $.sectionStack.push("conditionalElseFn");
    $.CONSUME(ElseToken); // "else"
    $.SUBRULE($.nakedStackFn);
    $.sectionStack.pop();
  };
}
