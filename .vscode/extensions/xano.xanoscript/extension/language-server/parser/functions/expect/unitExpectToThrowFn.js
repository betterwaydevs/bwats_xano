import { ToThrowToken } from "../../../lexer/expect.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function unitExpectToThrowFn($) {
  return () => {
    $.sectionStack.push("unitExpectToThrowFn");
    const fnToken = $.CONSUME(ToThrowToken); // "to_throw"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [fnToken, { "exception?": "[string]" }],
    });
    $.sectionStack.pop();
  };
}
