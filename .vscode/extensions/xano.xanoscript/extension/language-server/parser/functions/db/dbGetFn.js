import { GetToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";
import { addonSchema } from "./schema.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbGetFn($) {
  return () => {
    $.sectionStack.push("dbGetFn");
    const fnToken = $.CONSUME(GetToken); // "get"
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
          "description?": "[string]",
          "disabled?": "[boolean]",
          "output?": ["[string]"],
          "lock?": "[boolean]",
          "addon?": [addonSchema],
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
