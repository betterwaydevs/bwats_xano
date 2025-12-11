import { WebflowToken } from "../../lexer/api.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function webflowFn($) {
  return () => {
    $.sectionStack.push("webflow");
    $.CONSUME(WebflowToken); // "webflow"
    $.CONSUME(DotToken); // "."
    $.OR([
      {
        ALT: () => $.SUBRULE($.webflowRequestFn), // "webflow.request"
      },
    ]);
    $.sectionStack.pop();
  };
}
