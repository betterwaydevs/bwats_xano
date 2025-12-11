import { LCurly, RCurly } from "../../../lexer/control.js";
import {
  AddToken,
  AndToken,
  BitwiseToken,
  DivToken,
  ModToken,
  MulToken,
  OrToken,
  SubToken,
  XorToken,
} from "../../../lexer/math.js";
import { DotToken as DotToken, NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function allMathFn($) {
  return () => {
    let hasValue = false;
    $.sectionStack.push("allMathFn");
    $.OR([
      { ALT: () => $.CONSUME(AddToken) }, // math.add
      { ALT: () => $.CONSUME(DivToken) }, // math.div
      { ALT: () => $.CONSUME(ModToken) }, // math.mod
      { ALT: () => $.CONSUME(MulToken) }, // math.mul
      { ALT: () => $.CONSUME(SubToken) }, // math.sub
      {
        ALT: () => {
          $.CONSUME(BitwiseToken);
          $.CONSUME(DotToken);
          $.OR1([
            { ALT: () => $.CONSUME(AndToken) }, // math.bitwise.and
            { ALT: () => $.CONSUME(OrToken) }, // math.bitwise.or
            { ALT: () => $.CONSUME(XorToken) }, // math.bitwise.xor
          ]);
        },
      },
    ]);
    $.SUBRULE($.assignableVariableProperty);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR2([
        {
          ALT: () => {
            hasValue = true;
            $.SUBRULE($.valueFieldAttribute);
          },
        },
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
      ]);
    });

    if (!hasValue) {
      $.SUBRULE($.valueFieldAttribute);
    }

    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
