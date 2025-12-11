import { EqualToken, LCurly, RCurly } from "../../../lexer/control.js";
import { CheckPasswordToken } from "../../../lexer/security.js";
import { Identifier, NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function securityCheckPasswordFn($) {
  return () => {
    $.sectionStack.push("securityCheckPasswordFn");
    const fnToken = $.CONSUME(CheckPasswordToken); // "check_password"
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.CONSUME1(Identifier); // "field_name"
      $.CONSUME(EqualToken); // "="
      $.SUBRULE($.expressionFn);
    });
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
