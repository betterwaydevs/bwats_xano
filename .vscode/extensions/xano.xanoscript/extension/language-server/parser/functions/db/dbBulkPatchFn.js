import { PatchToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbBulkPatchFn($) {
  return () => {
    $.sectionStack.push("dbBulkPatchFn");
    const fnToken = $.CONSUME(PatchToken); // "patch"
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
          "items?": "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });

    $.sectionStack.pop();
  };
}
