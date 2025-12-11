import { AddToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";
import { addonSchema } from "./schema.js";
/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbAddFn($) {
  return () => {
    $.sectionStack.push("dbAddFn");
    const fnToken = $.CONSUME(AddToken); // "add"

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
          data: { "[string]": "[expression]" },
          "description?": "[string]",
          "disabled?": "[boolean]",
          "addon?": [addonSchema],
          "mock?": { "![string]": "[expression]" },
          "output?": ["[string]"],
        },
      ],
    });

    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
