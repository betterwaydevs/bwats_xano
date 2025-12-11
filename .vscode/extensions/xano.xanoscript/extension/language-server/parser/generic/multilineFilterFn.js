import { PipeToken } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * Represents a multiline filter function in XanoScript
 *
 * Handles expression filters and query search filters
 * e.g. |filterName:arg1:arg2 or |!filterName:arg1:arg2 (disabled)
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function multilineFilterFn($) {
  return (options = {}) => {
    $.SUBRULE($.filterFn, { ARGS: [options] });
    $.MANY({
      // This is a tricky one, we allow a new line breaking an expression but only
      // if the following line is a filter (starts with a pipe)
      // We use LookAhead to peek at the next tokens without consuming them
      // to decide if we should close or keep the gate open
      GATE: () =>
        $.LA(1).tokenType === PipeToken ||
        ($.LA(1).tokenType === NewlineToken && $.LA(2).tokenType === PipeToken),
      DEF: () => {
        $.SUBRULE1($.filterFn, { ARGS: [options] });
      },
    });
  };
}
