import { LParent, RParent } from "../../../lexer/control.js";
import { ToBeWithinToken } from "../../../lexer/expect.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function workflowExpectToBeWithinFn($) {
  const requiredAttrs = ["min", "max"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("workflowExpectToBeWithinFn");
    const fnToken = $.CONSUME(ToBeWithinToken); // "to_be_within"
    $.CONSUME(LParent); // "("
    $.SUBRULE($.expressionFn); // "$foo|get:bar:null"
    $.CONSUME(RParent); // ")"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
