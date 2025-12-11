import { DeleteToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbBulkDeleteFn($) {
  return () => {
    $.sectionStack.push("dbBulkDeleteFn");
    const fnToken = $.CONSUME(DeleteToken); // "delete"
    $.OR({
      DEF: [
        { ALT: () => $.CONSUME(Identifier) }, // user
        { ALT: () => $.CONSUME1(StringLiteral) }, // "user table"
      ],
      ERR_MSG: "Expected a table name",
    });

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          "where?": "[query]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });

    $.sectionStack.pop();
  };
}
