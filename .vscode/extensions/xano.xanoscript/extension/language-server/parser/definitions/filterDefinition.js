import { EqualToken, PipeToken } from "../../lexer/control.js";
import { FiltersToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function filterDefinition($) {
  /**
   * @param {string} inputTypeToken the type of the input, e.g., "object", "array", etc.
   */
  return (inputTypeToken = null) => {
    $.sectionStack.push("filterDefinition");
    $.CONSUME(FiltersToken); // e.g., "filters"
    $.CONSUME(EqualToken); // "="
    $.AT_LEAST_ONE_SEP({
      // One or more filters separated by |
      SEP: PipeToken,
      DEF: () => $.SUBRULE($.inputFilterFn, { ARGS: [inputTypeToken] }), // e.g., "trim | lowercase"
    });
    $.sectionStack.pop();
  };
}
