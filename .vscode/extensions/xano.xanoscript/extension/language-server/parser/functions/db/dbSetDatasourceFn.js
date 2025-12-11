import { SetDatasourceToken } from "../../../lexer/db.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function dbSetDatasourceFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("dbSetDatasourceFn");
    const fnToken = $.CONSUME(SetDatasourceToken); // "set_datasource"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
