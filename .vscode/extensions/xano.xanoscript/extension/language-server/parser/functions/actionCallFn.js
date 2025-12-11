import { ActionToken, CallToken } from "../../lexer/action.js";
import { StringLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function actionCallFn($) {
  return () => {
    $.sectionStack.push("actionCallFn");
    $.CONSUME(ActionToken); // "action"
    $.CONSUME(DotToken); // "."
    const fnToken = $.CONSUME(CallToken); // "call"

    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user/ auth"
    ]);

    $.OPTION(() => {
      $.SUBRULE($.schemaParseAttributeFn, {
        ARGS: [
          fnToken,
          {
            "package?": "[string]",
            "input?": { "[string]": "[expression]" },
            "mock?": { "![string]": "[expression]" },
            "registry?": { "[string]": "[expression]" },
            "description?": "[string]",
            "disabled?": "[boolean]",
          },
        ],
      });
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
