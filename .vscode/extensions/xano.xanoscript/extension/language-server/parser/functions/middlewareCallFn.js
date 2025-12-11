import { CallToken } from "../../lexer/action.js";
import { StringLiteral } from "../../lexer/literal.js";
import { MiddlewareToken } from "../../lexer/middleware.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function middlewareCallFn($) {
  return () => {
    $.sectionStack.push("middlewareCallFn");
    $.CONSUME(MiddlewareToken); // "middleware"
    $.CONSUME(DotToken); // "."
    const fnToken = $.CONSUME(CallToken); // "call"

    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user auth"
    ]);

    $.OPTION(() => {
      $.SUBRULE($.schemaParseAttributeFn, {
        ARGS: [
          fnToken,
          {
            input: {
              vars: "[expression]",
              type: "[expression]",
            },
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
