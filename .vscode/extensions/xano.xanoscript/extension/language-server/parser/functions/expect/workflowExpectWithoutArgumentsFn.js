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

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function workflowExpectWithoutArgumentsFn($) {
  return () => {
    $.sectionStack.push("workflowExpectWithoutArgumentsFn");
    const fnToken = $.OR([
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
    $.SUBRULE($.expressionFn); // "$foo|get:bar:null"
    $.CONSUME(RParent); // ")"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, [], ["description", "disabled"]],
    });
    $.sectionStack.pop();
  };
}
