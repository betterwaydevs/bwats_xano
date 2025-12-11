import {
  ContainsToken,
  EndsWithToken,
  IContainsToken,
  IEndsWithToken,
  IStartsWithToken,
  StartsWithToken,
} from "../../../lexer/text.js";

/**
 * text.contains $x1 {
 *   value = "Hello"
 * } as $x2
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function allTextWithReturnValueFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];
    $.sectionStack.push("allTextWithReturnValueFn");
    const fnToken = $.OR([
      { ALT: () => $.CONSUME(ContainsToken) },
      { ALT: () => $.CONSUME(EndsWithToken) },
      { ALT: () => $.CONSUME(IContainsToken) },
      { ALT: () => $.CONSUME(IEndsWithToken) },
      { ALT: () => $.CONSUME(IStartsWithToken) },
      { ALT: () => $.CONSUME(StartsWithToken) },
    ]);
    $.SUBRULE($.assignableVariableProperty); // $x1
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
