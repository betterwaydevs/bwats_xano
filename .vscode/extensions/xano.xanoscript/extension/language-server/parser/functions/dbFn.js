import { DbToken } from "../../lexer/db.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbFn($) {
  return () => {
    $.sectionStack.push("db");
    $.CONSUME(DbToken); // "db"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.dbExternalFn) }, // "db.external"
      { ALT: () => $.SUBRULE($.dbGetFn) }, // "db.get"
      { ALT: () => $.SUBRULE($.dbHasFn) }, // "db.has"
      { ALT: () => $.SUBRULE($.dbEditFn) }, // "db.edit"
      { ALT: () => $.SUBRULE($.dbDelFn) }, // "db.delete"
      { ALT: () => $.SUBRULE($.dbAddFn) }, // "db.add"
      { ALT: () => $.SUBRULE($.dbDirectQueryFn) }, // "db.direct_query"
      { ALT: () => $.SUBRULE($.dbSetDatasourceFn) }, // "db.set_datasource"
      { ALT: () => $.SUBRULE($.dbQueryFn) }, // "db.query"
      { ALT: () => $.SUBRULE($.dbSchemaFn) }, // "db.schema"
      { ALT: () => $.SUBRULE($.dbTruncateFn) }, // "db.truncate"
      { ALT: () => $.SUBRULE($.dbTransactionFn) }, // "db.transaction"
      { ALT: () => $.SUBRULE($.dbPatchFn) }, // "db.patch"
      { ALT: () => $.SUBRULE($.dbBulkFn) }, // "db.bulk"
      { ALT: () => $.SUBRULE($.dbAddOrEditFn) }, // db.add_or_edit
    ]);
    $.sectionStack.pop();
  };
}
