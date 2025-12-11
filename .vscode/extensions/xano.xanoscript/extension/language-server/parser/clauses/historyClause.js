import { EqualToken } from "../../lexer/control.js";
import { HistoryToken } from "../../lexer/tokens.js";

/**
 * Parses the history clause.
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function historyClause($) {
  return () => {
    $.sectionStack.push("historyClause");
    const parent = $.CONSUME(HistoryToken); // "history"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.schemaParseEnumFn, {
      ARGS: [parent, [false, "inherit", 0, 10, 100, 1000, 10000, "all"]],
    });

    $.sectionStack.pop();
  };
}
