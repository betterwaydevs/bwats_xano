import {
  BreakToken,
  CaseToken,
  LParent,
  RParent,
} from "../../../lexer/control.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function switchCaseFn($) {
  return () => {
    $.sectionStack.push("switchCaseFn");
    $.CONSUME(CaseToken); // "case"
    $.CONSUME(LParent); // "("
    $.SUBRULE($.expressionFn);
    $.CONSUME(RParent); // ")"
    $.OPTION(() => $.SUBRULE($.nakedStackFn));
    $.OPTION1(() => $.CONSUME(BreakToken)); // "break"
    $.sectionStack.pop();
  };
}
