import { EqualToken } from "../../lexer/control.js";
import { MockToken, NewlineToken } from "../../lexer/tokens.js";

/**
 * @deprecated - use functionAttrReq instead
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function mockAttribute($) {
  return () => {
    $.sectionStack.push("mockAttribute");

    const name = $.CONSUME(MockToken); // "mock"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.schemaParseObjectFn, {
      ARGS: [name, { "![string]": "[expression]" }],
    });
    $.MANY(() => $.CONSUME(NewlineToken));

    $.sectionStack.pop();
  };
}
