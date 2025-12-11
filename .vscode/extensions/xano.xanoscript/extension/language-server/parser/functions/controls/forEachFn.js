import {
  AsToken,
  EachToken,
  ForeachToken,
  LCurly,
  LParent,
  RCurly,
  RemoveToken,
  RParent,
} from "../../../lexer/control.js";
import { DotToken, NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function forEachFn($) {
  return () => {
    let hasEach = false;
    $.sectionStack.push("forEachFn");
    $.CONSUME(ForeachToken); // "forEach"

    $.OR([
      {
        ALT: () => {
          // foreach.remove
          $.CONSUME(DotToken);
          $.CONSUME(RemoveToken);
        },
      },
      {
        ALT: () => {
          $.CONSUME(LParent); // "("
          $.SUBRULE($.expressionFn); // $value.items
          $.CONSUME(RParent); // ")"
          $.OPTION(() => {
            $.CONSUME(LCurly); // "{"
            $.MANY(() => {
              $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
              $.OR1([
                { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
                { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
                {
                  ALT: () => {
                    hasEach = true;
                    $.CONSUME(EachToken); // "each"
                    $.CONSUME(AsToken); // "as"
                    $.SUBRULE($.assignableVariableAs); // "$item"
                    $.OPTION1(() => $.SUBRULE1($.nakedStackFn));
                  },
                },
              ]);
            });

            if (!hasEach) {
              $.CONSUME1(EachToken); // "each"
              $.CONSUME1(AsToken); // "as"
              $.SUBRULE($.assignableVariableAs); // "$item"
              $.OPTION2(() => $.SUBRULE2($.nakedStackFn));
            }

            $.MANY2(() => $.CONSUME1(NewlineToken));
            $.CONSUME(RCurly); // "}"
          });
        },
      },
    ]);

    $.sectionStack.pop();
  };
}
