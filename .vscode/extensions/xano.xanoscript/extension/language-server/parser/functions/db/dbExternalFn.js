import {
  ExternalToken,
  MssqlToken,
  MysqlToken,
  OracleToken,
  PostgresToken,
} from "../../../lexer/db.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbExternalFn($) {
  return () => {
    $.sectionStack.push("dbExternalFn");
    $.CONSUME(ExternalToken); // "external"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.CONSUME(MssqlToken) }, // "external.mssql"
      { ALT: () => $.CONSUME(MysqlToken) }, // "external.mysql"
      { ALT: () => $.CONSUME(OracleToken) }, // "external.oracle"
      { ALT: () => $.CONSUME(PostgresToken) }, // "external.postgres"
    ]);
    $.CONSUME1(DotToken); // "."
    $.SUBRULE($.dbExternalDirectQueryFn); // "external.direct_query"

    $.sectionStack.pop();
  };
}
