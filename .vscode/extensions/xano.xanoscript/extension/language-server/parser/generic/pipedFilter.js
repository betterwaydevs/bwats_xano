import { ColonToken, PipeToken } from "../../lexer/control.js";
import { Identifier } from "../../lexer/tokens.js";
/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function pipedFilter($) {
  return () => {
    // TODO: fix invalid filter name error reporting
    $.AT_LEAST_ONE(() => {
      $.CONSUME(PipeToken);
      $.CONSUME(Identifier);
      $.MANY1(() => {
        $.CONSUME(ColonToken);
        $.SUBRULE($.expressionFn);
      });
    });
  };
}
