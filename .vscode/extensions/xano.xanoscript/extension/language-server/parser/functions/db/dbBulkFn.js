import { BulkToken } from "../../../lexer/db.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbBulkFn($) {
  return () => {
    $.sectionStack.push("db.bulk");
    $.CONSUME(BulkToken); // "bulk"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.dbBulkDeleteFn) }, // "db.bulk.delete"
      { ALT: () => $.SUBRULE($.dbBulkUpdateFn) }, // "db.bulk.update"
      { ALT: () => $.SUBRULE($.dbBulkPatchFn) }, // "db.bulk.patch"
      { ALT: () => $.SUBRULE($.dbBulkAddFn) }, // "db.bulk.add"
    ]);
    $.sectionStack.pop();
  };
}
