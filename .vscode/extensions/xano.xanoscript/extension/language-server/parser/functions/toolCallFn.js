import { CallToken } from "../../lexer/action.js";
import { StringLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";
import { ToolToken } from "../../lexer/tool.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function toolCallFn($) {
  return () => {
    $.sectionStack.push("toolCallFn");
    $.CONSUME(ToolToken); // "tool"
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
            "input?": { "[string]": "[expression]" },
            "mock?": { "![string]": "[expression]" },
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
