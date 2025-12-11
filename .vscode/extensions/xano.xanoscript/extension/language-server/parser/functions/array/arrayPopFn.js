import { PopToken } from "../../../lexer/arrays.js";

// array.pop {
//   value = "test"
// } as test
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayPopFn($) {
  return () => {
    $.sectionStack.push("arrayPopFn");
    $.CONSUME(PopToken); // "pop"
    $.SUBRULE($.variableOnly);
    $.SUBRULE($.arrayNoValueAs);
    $.sectionStack.pop();
  };
}
