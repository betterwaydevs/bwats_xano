import { LSquare, RSquare } from "../../lexer/control.js";
import {
  FloatLiteral,
  IntegerLiteral,
  SingleQuotedStringLiteral,
  StringLiteral,
} from "../../lexer/literal.js";
import {
  FalseToken,
  NowToken,
  NullToken,
  TrueToken,
} from "../../lexer/tokens.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function valueExpressionForResponse($) {
  // []
  if (!Object.hasOwn($, "emptyArray")) {
    $.emptyArray = $.RULE("emptyArray", () => {
      $.CONSUME(LSquare);
      $.CONSUME(RSquare);
    });
  }

  return () => {
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) }, // e.g., "default value"
      { ALT: () => $.CONSUME(SingleQuotedStringLiteral) }, // e.g., 'They said: "hello!"'
      { ALT: () => $.CONSUME(FloatLiteral) }, // e.g., 42.54
      { ALT: () => $.CONSUME(IntegerLiteral) }, // e.g., 42
      { ALT: () => $.CONSUME(TrueToken) }, // true
      { ALT: () => $.CONSUME(FalseToken) }, // false
      { ALT: () => $.CONSUME(NowToken) }, // now
      { ALT: () => $.CONSUME(NullToken) }, // null
      { ALT: () => $.SUBRULE($.longFormVariable) }, // $var.users
      { ALT: () => $.SUBRULE($.completeAuthVariable) }, // $auth.my_api_key
      { ALT: () => $.SUBRULE($.completeEnvVariable) }, // $env.my_api_key
      { ALT: () => $.SUBRULE($.completeInputVariable) }, // $input.body
      { ALT: () => $.SUBRULE($.shortFormVariable) }, // $users.y.z
      { ALT: () => $.SUBRULE($.castedValue) }, // !array "[]"
      { ALT: () => $.SUBRULE($.emptyArray) }, // []
    ]);
    $.OPTION(() => {
      $.SUBRULE($.pipedFilter);
    });
  };
}
