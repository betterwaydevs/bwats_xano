import { SchemaToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbSchemaFn($) {
  return () => {
    const requiredAttrs = [];
    const optionalAttrs = ["description", "disabled", "path"];

    $.sectionStack.push("dbSchemaFn");
    const fnToken = $.CONSUME(SchemaToken); // "schema"
    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user table"
    ]);
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
