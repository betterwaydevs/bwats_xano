import { StringLiteral } from "../../../lexer/literal.js";
import { CallToken, TaskToken } from "../../../lexer/task.js";
import { DotToken, Identifier } from "../../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function taskCallFn($) {
  const requiredAttrs = [];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("taskCallFn");
    $.CONSUME(TaskToken); // "task"
    $.CONSUME(DotToken); // "."
    const fnToken = $.CONSUME(CallToken); // "call"

    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user/ auth"
    ]);

    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
