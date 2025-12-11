import { AddonToken, CallToken } from "../../lexer/addon.js";
import { StringLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function addonCallFn($) {
  return () => {
    $.sectionStack.push("addonCallFn");
    $.CONSUME(AddonToken); // "addon"
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
