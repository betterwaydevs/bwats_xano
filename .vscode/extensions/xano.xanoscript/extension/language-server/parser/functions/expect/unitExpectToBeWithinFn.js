import { LParent, RParent } from "../../../lexer/control.js";
import { ToBeWithinToken } from "../../../lexer/expect.js";
import { DotToken, Identifier } from "../../../lexer/tokens.js";
import { ResponseVariable } from "../../../lexer/variables.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function unitExpectToBeWithinFn($) {
  const requiredAttrs = ["min", "max"];
  const optionalAttrs = [];

  return () => {
    $.sectionStack.push("unitExpectToBeWithinFn");
    const fnToken = $.CONSUME(ToBeWithinToken); // "to_be_within"
    $.CONSUME(LParent); // "("
    $.CONSUME(ResponseVariable); // "$response"
    $.MANY(() => {
      $.CONSUME(DotToken); // "."
      $.CONSUME(Identifier); // "x", "users", etc.
    });
    $.CONSUME(RParent); // ")"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
