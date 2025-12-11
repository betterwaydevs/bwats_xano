import {
  LCurly,
  LParent,
  RCurly,
  RParent,
  SwitchToken,
} from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function switchFn($) {
  return () => {
    $.sectionStack.push("switchFn");
    $.CONSUME(SwitchToken); // "switch"
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
              $.MANY1(() => {
                $.MANY3(() => $.CONSUME3(NewlineToken));
                $.SUBRULE($.switchCaseFn);
              });
            },
          },
        ]);
      });

      // finally, the optional default case
      $.OPTION1(() => {
        $.MANY4(() => $.CONSUME4(NewlineToken));
        $.SUBRULE($.switchDefaultFn);
      });

      $.MANY2(() => $.CONSUME1(NewlineToken));
      $.CONSUME(RCurly); // "}"
    });

    $.sectionStack.pop();
  };
}
