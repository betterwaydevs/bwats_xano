import { QueryToken } from "../../../lexer/db.js";
import { StringLiteral } from "../../../lexer/literal.js";
import { Identifier } from "../../../lexer/tokens.js";
import { addonSchema } from "./schema.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function dbQueryFn($) {
  return () => {
    $.sectionStack.push("dbQueryFn");
    const fnToken = $.CONSUME(QueryToken); // "query"
    $.OR([
      { ALT: () => $.CONSUME(Identifier) }, // user
      { ALT: () => $.CONSUME1(StringLiteral) }, // "user table"
    ]);

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          "eval?": { "[string]": "[query]" },
          "return?": {
            type: ["list", "stream", "exists", "count", "single", "aggregate"],
            "paging?": {
              "page?": "[expression]",
              "per_page?": "[expression]",
              "offset?": "[expression]",
              "totals?": "[boolean]",
              "metadata?": "[boolean]",
            },
            "distinct?": ["yes", "no"],
            "group?": { "[string]": "[query]" },
            "eval?": { "[string]": "[expression]" },
          },
          "join?": {
            "[string]": {
              table: "[string]",
              "type?": ["inner", "left", "right"],
              "where?": "[query]",
            },
          },
          "lock?": "[boolean]",
          "disabled?": "[boolean]",
          "description?": "[string]",
          "mock?": { "![string]": "[expression]" },
          "addon?": [addonSchema],
          "sort?": { "[string]": ["asc", "desc", "rand"] },
          "override_sort?": "[expression]",
          "output?": ["[string]"],
          "where?": "[query]",
          "additional_where?": "[query]",
        },
      ],
    });

    // db.query rule is used within an addon declaration, but
    // in this context we don't allow "as" variable assignment
    const isAddonContext = $.sectionStack.includes("addonDeclaration");
    $.OR1([
      {
        GATE: () => !isAddonContext,
        ALT: () => $.SUBRULE($.asVariable, { ARGS: [fnToken] }),
      },
      {
        GATE: () => isAddonContext,
        ALT: () => {},
      },
    ]);

    $.sectionStack.pop();
  };
}
