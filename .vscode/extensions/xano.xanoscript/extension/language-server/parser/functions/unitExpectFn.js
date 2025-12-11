import { ExpectToken } from "../../lexer/expect.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function unitExpectFn($) {
  return () => {
    $.sectionStack.push("unitExpect");
    $.CONSUME(ExpectToken); // "expect"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.unitExpectWithArgumentsFn) }, // "expect.to_equal, expect.to_start_with, etc."
      { ALT: () => $.SUBRULE($.unitExpectWithoutArgumentsFn) }, // "expect.to_be_true, expect.to_be_defined, etc."
      { ALT: () => $.SUBRULE($.unitExpectToThrowFn) }, // "expect.to_throw"
      { ALT: () => $.SUBRULE($.unitExpectToBeWithinFn) }, // "expect.to_be_within"
    ]);
    $.sectionStack.pop();
  };
}
