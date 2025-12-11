import { LParent, RParent } from "../../../lexer/control.js";
import {
  ToBeDefinedToken,
  ToBeEmptyToken,
  ToBeFalseToken,
  ToBeInTheFutureToken,
  ToBeInThePastToken,
  ToBeNullToken,
  ToBeTrueToken,
  ToNotBeDefinedToken,
  ToNotBeNullToken,
} from "../../../lexer/expect.js";
import { DotToken, Identifier } from "../../../lexer/tokens.js";
import { ResponseVariable } from "../../../lexer/variables.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function unitExpectWithoutArgumentsFn($) {
  return () => {
    $.sectionStack.push("unitExpectWithoutArgumentsFn");
    $.OR([
      { ALT: () => $.CONSUME(ToBeTrueToken) }, // "to_be_true"
      { ALT: () => $.CONSUME(ToBeFalseToken) }, // "to_be_false"
      { ALT: () => $.CONSUME(ToBeInThePastToken) }, // "to_be_in_the_past"
      { ALT: () => $.CONSUME(ToBeInTheFutureToken) }, // "to_be_in_the_future"
      { ALT: () => $.CONSUME(ToBeDefinedToken) }, // "to_be_defined"
      { ALT: () => $.CONSUME(ToNotBeDefinedToken) }, // "to_not_be_defined"
      { ALT: () => $.CONSUME(ToBeNullToken) }, // "to_be_null"
      { ALT: () => $.CONSUME(ToNotBeNullToken) }, // "to_not_be_null"
      { ALT: () => $.CONSUME(ToBeEmptyToken) }, // "to_be_empty"
    ]);
    $.CONSUME(LParent); // "("
    $.CONSUME(ResponseVariable); // "$response"
    $.MANY(() => {
      $.CONSUME(DotToken); // "."
      $.CONSUME(Identifier); // "x", "users", etc.
    });
    $.CONSUME(RParent); // ")"
    $.sectionStack.pop();
  };
}
