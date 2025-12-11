import { LParent, RParent } from "../../../lexer/control.js";
import {
  ToBeGreaterThanToken,
  ToBeLessThanToken,
  ToContainToken,
  ToEndWithToken,
  ToEqualToken,
  ToMatchToken,
  ToNotEqualToken,
  ToStartWithToken,
} from "../../../lexer/expect.js";
import { DotToken, Identifier } from "../../../lexer/tokens.js";
import { ResponseVariable } from "../../../lexer/variables.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function unitExpectWithArgumentsFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = [];

  return () => {
    $.sectionStack.push("unitExpectWithArgumentsFn");
    const fnToken = $.OR([
      { ALT: () => $.CONSUME(ToEqualToken) }, // "to_equal"
      { ALT: () => $.CONSUME(ToStartWithToken) }, // "to_start_with"
      { ALT: () => $.CONSUME(ToEndWithToken) }, // "to_end_with"
      { ALT: () => $.CONSUME(ToBeGreaterThanToken) }, // "to_be_greater_than"
      { ALT: () => $.CONSUME(ToBeLessThanToken) }, // "to_be_less_than"
      { ALT: () => $.CONSUME(ToMatchToken) }, // "to_match"
      { ALT: () => $.CONSUME(ToNotEqualToken) }, // "to_not_equal"
      { ALT: () => $.CONSUME(ToContainToken) }, // "to_contain"
    ]);
    $.CONSUME(LParent); // "("
    $.CONSUME(ResponseVariable); // "$response"
    $.MANY(() => {
      $.CONSUME(DotToken); // "."
      $.CONSUME(Identifier); // "x", "users", etc.
    });
    $.CONSUME(RParent); // ")"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
