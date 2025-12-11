import { ExpectToken } from "../../lexer/expect.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function workflowExpectFn($) {
  return () => {
    $.sectionStack.push("workflowExpect");
    $.CONSUME(ExpectToken); // "expect"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.workflowExpectWithArgumentsFn) }, // "expect.to_equal, expect.to_start_with, etc."
      { ALT: () => $.SUBRULE($.workflowExpectWithoutArgumentsFn) }, // "expect.to_be_true, expect.to_be_defined, etc."
      { ALT: () => $.SUBRULE($.workflowExpectToThrowFn) }, // "expect.to_throw"
      { ALT: () => $.SUBRULE($.workflowExpectToBeWithinFn) }, // "expect.to_be_within"
    ]);
    $.sectionStack.pop();
  };
}
