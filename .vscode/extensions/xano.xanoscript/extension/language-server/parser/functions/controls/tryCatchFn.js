import {
  CatchToken,
  FinallyToken,
  LCurly,
  RCurly,
  TryCatchToken,
  TryToken,
} from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function tryCatchFn($) {
  return () => {
    let hasTry = false;
    let hasCatch = false;

    $.sectionStack.push("tryCatchFn");
    $.CONSUME(TryCatchToken); // "try_catch"
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR([
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
        {
          ALT: () => {
            hasTry = true;
            $.CONSUME(TryToken);
            $.OPTION(() => $.SUBRULE($.nakedStackFn));
          },
        },
        {
          ALT: () => {
            hasCatch = true;
            $.CONSUME(CatchToken);
            $.sectionStack.push("catchFn");
            $.OPTION1(() => $.SUBRULE1($.nakedStackFn));
            $.sectionStack.pop();
          },
        },
        {
          ALT: () => {
            $.CONSUME(FinallyToken);
            $.OPTION2(() => $.SUBRULE2($.nakedStackFn));
          },
        },
      ]);
    });

    if (!hasTry) {
      $.CONSUME(TryToken);
      $.SUBRULE($.nakedStackFn);
    }

    if (!hasCatch) {
      $.CONSUME(CatchToken);
      $.SUBRULE($.nakedStackFn);
    }

    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"

    $.sectionStack.pop();
  };
}
