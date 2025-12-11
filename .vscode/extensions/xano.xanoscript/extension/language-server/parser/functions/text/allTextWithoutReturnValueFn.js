import {
  AppendToken,
  LTrimToken,
  PrependToken,
  RTrimToken,
  TrimToken,
} from "../../../lexer/text.js";

/**
 * append $x1 {
 *   value = "text"
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function allTextWithoutReturnValueFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("allTextWithoutReturnValueFn");
    const fnToken = $.OR([
      { ALT: () => $.CONSUME(AppendToken) }, // append
      { ALT: () => $.CONSUME(LTrimToken) }, // ltrim
      { ALT: () => $.CONSUME(PrependToken) }, // prepend
      { ALT: () => $.CONSUME(RTrimToken) }, // rtrim
      { ALT: () => $.CONSUME(TrimToken) }, // trim
    ]);
    $.SUBRULE($.assignableVariableProperty); // $x1
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
