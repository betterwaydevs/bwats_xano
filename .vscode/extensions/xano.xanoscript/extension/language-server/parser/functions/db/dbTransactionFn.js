import { LCurly, RCurly } from "../../../lexer/control.js";
import { TransactionToken } from "../../../lexer/db.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * transaction {
 *   stack {
 *     util.get_env as $x3
 *   }
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function dbTransactionFn($) {
  return () => {
    let hasStack = false;

    $.sectionStack.push("dbTransactionFn");
    $.CONSUME(TransactionToken); // "transaction"
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken));
      $.OR([
        { ALT: () => $.SUBRULE($.descriptionFieldAttribute) },
        { ALT: () => $.SUBRULE($.disabledFieldAttribute) },
        {
          ALT: () => {
            hasStack = true;
            $.SUBRULE($.stackClause);
          },
        },
      ]);
    });

    if (!hasStack) {
      $.SUBRULE($.stackClause);
    }

    $.MANY1(() => $.CONSUME1(NewlineToken));
    $.CONSUME(RCurly); // "}"

    $.sectionStack.pop();
  };
}
