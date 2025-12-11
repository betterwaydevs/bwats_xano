import { EqualToken } from "../../lexer/control.js";
import { IndexToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function indexClause($) {
  return () => {
    $.sectionStack.push("indexClause");
    const parent = $.CONSUME(IndexToken); // "index"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.schemaFn, {
      ARGS: [
        parent,
        [
          {
            type: [
              "primary",
              "btree",
              "gin",
              "btree|unique",
              "search",
              "vector",
            ],
            field: [{ name: "[string]", "op?": "[string]" }],
            "lang?": "[string]",
            "name?": "[string]",
          },
        ],
      ],
    });

    $.sectionStack.pop();
  };
}
