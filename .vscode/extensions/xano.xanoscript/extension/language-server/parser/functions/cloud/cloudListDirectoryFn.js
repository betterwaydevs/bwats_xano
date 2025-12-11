import { ListDirectoryToken } from "../../../lexer/cloud.js";
import { EqualToken, LCurly, RCurly } from "../../../lexer/control.js";
import { Identifier, NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudListDirectoryFn($) {
  return () => {
    $.sectionStack.push("cloudListDirectoryFn");
    const fnToken = $.CONSUME(ListDirectoryToken); // "list_directory"
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
