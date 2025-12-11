import {
  EachToken,
  LCurly,
  LParent,
  RCurly,
  RParent,
  WhileToken,
} from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function whileFn($) {
  return () => {
    let hasEach = false;
    $.sectionStack.push("whileFn");
    $.CONSUME(WhileToken); // "while"
    $.CONSUME(LParent); // "("
    $.MANY(() => $.CONSUME(NewlineToken));
    $.SUBRULE($.expressionFn); // `$value > 10`
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RParent); // ")"
    $.OPTION(() => {
      $.CONSUME(LCurly); // "{"
      $.MANY2(() => {
        $.AT_LEAST_ONE(() => $.CONSUME2(NewlineToken));
        $.OR([
          { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
          { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
          {
            ALT: () => {
              hasEach = true;
              $.CONSUME(EachToken); // "each"
              $.OPTION1(() => $.SUBRULE($.nakedStackFn));
            },
          },
        ]);
      });

      if (!hasEach) {
        $.CONSUME(EachToken); // "each"
        $.SUBRULE($.nakedStackFn);
      }

      $.MANY3(() => $.CONSUME3(NewlineToken));
      $.CONSUME(RCurly); // "}"
    });

    $.sectionStack.pop();
  };
}
