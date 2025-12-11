import { ToThrowToken } from "../../../lexer/expect.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function workflowExpectToThrowFn($) {
  return () => {
    $.sectionStack.push("workflowExpectToThrowFn");
    const fnToken = $.CONSUME(ToThrowToken); // "to_throw"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          "stack?": "[test-stack]",
          "exception?": "[string]",
        },
      ],
    });
    $.sectionStack.pop();
  };
}
