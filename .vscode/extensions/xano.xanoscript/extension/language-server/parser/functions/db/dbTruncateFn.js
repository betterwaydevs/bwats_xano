import { TruncateToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbTruncateFn($) {
  return () => {
    $.sectionStack.push("dbTruncateFn");
    const fnToken = $.CONSUME(TruncateToken); // "truncate"
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
          "reset?": "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });

    $.sectionStack.pop();
  };
}
