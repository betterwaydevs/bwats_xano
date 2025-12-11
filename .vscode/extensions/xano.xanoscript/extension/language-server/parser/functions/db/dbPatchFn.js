import { PatchToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";
import { addonSchema } from "./schema.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbPatchFn($) {
  return () => {
    $.sectionStack.push("dbPatchFn");
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
          field_name: "[expression]",
          field_value: "[expression]",
          data: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "addon?": [addonSchema],
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
