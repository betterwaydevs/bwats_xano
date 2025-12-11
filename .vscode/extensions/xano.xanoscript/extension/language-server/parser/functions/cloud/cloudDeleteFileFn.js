import { DeleteFileToken } from "../../../lexer/cloud.js";
import { EqualToken, LCurly, RCurly } from "../../../lexer/control.js";
import { Identifier, NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudDeleteFileFn($) {
  return () => {
    $.sectionStack.push("cloudDeleteFileFn");
    $.CONSUME(DeleteFileToken); // "delete_file"
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.CONSUME1(Identifier); // "field_name"
      $.CONSUME(EqualToken); // "="
      $.SUBRULE($.expressionFn);
    });
    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
