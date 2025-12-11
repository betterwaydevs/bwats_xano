import { EqualToken } from "../../lexer/control.js";
import {
  FloatLiteral,
  IntegerLiteral,
  StringLiteral,
} from "../../lexer/literal.js";
import {
  FalseToken,
  Identifier,
  NowToken,
  TrueToken,
} from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function columnDefaultValueAttribute($) {
  return () => {
    $.sectionStack.push("columnDefaultValueAttribute");
    $.CONSUME(EqualToken); // "="
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) }, // e.g., "default value"
      { ALT: () => $.CONSUME(FloatLiteral) }, // e.g., 42.54
      { ALT: () => $.CONSUME(IntegerLiteral) }, // e.g., 42
      { ALT: () => $.CONSUME(TrueToken) }, // true
      { ALT: () => $.CONSUME(FalseToken) }, // false
      { ALT: () => $.CONSUME(NowToken) }, // now
      { ALT: () => $.CONSUME(Identifier) }, // when everything else fails, it's an identifier
    ]);
    $.sectionStack.pop();
  };
}
