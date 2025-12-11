import { ElseifToken, LParent, RParent } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function conditionalElifFn($) {
  return () => {
    $.sectionStack.push("conditionalElifFn");
    $.CONSUME(ElseifToken); // "elseif"
    $.CONSUME(LParent); // "("
    $.MANY(() => $.CONSUME(NewlineToken));
    $.SUBRULE($.expressionFn);
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RParent); // ")"
    $.OPTION(() => $.SUBRULE($.nakedStackFn));
    $.sectionStack.pop();
  };
}
