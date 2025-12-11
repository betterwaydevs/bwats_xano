import { CallToken, FunctionToken } from "../../../lexer/function.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { DotToken, Identifier } from "../../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function functionCallFn($) {
  const requiredAttrs = [];
  const optionalAttrs = ["input", "description", "disabled"];

  return () => {
    $.sectionStack.push("functionCallFn");
    $.CONSUME(FunctionToken); // "function"
    $.CONSUME(DotToken); // "."
    const fnToken = $.CONSUME(CallToken); // "call"

    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user/ auth"
    ]);

    $.SUBRULE($.functionAttrReq, {
      ARGS: [
        fnToken,
        requiredAttrs,
        optionalAttrs,
        {
          allowObject: ["input"],
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
