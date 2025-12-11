import {
  AsToken,
  EachToken,
  ForToken,
  LCurly,
  LParent,
  RCurly,
  RParent,
} from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function forFn($) {
  return () => {
    let hasEach = false;
    $.sectionStack.push("forFn");
    $.CONSUME(ForToken); // "for"
    $.CONSUME(LParent); // "("
    $.SUBRULE($.expressionFn);
    $.CONSUME(RParent); // ")"
    $.OPTION(() => {
      $.CONSUME(LCurly); // "{"
      $.MANY(() => {
        $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
        $.OR([
          { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
          { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
          {
            ALT: () => {
              hasEach = true;
              $.CONSUME(EachToken); // "each"
              $.CONSUME(AsToken); // "as"
              $.SUBRULE($.assignableVariableAs); // "$index"
              $.OPTION1(() => $.SUBRULE1($.nakedStackFn));
            },
          },
        ]);
      });

      if (!hasEach) {
        $.CONSUME1(EachToken); // "each"
        $.CONSUME1(AsToken); // "as"
        $.SUBRULE($.assignableVariableAs); // "$index"
        $.OPTION2(() => $.SUBRULE2($.nakedStackFn));
      }

      $.MANY2(() => $.CONSUME1(NewlineToken));
      $.CONSUME(RCurly); // "}"
    });

    $.sectionStack.pop();
  };
}
