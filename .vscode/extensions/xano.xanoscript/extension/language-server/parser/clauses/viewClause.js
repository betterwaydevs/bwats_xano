import { EqualToken } from "../../lexer/control.js";
import { ViewToken } from "../../lexer/tokens.js";

/**
 * view = {
 *   "pending applications": {
 *     search: $db.status == "pending"
 *     sort  : {id: "asc"}
 *     id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
 *   }
 * }
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function viewClause($) {
  return () => {
    $.sectionStack.push("viewClause");
    const parent = $.CONSUME(ViewToken); // "view"
    $.CONSUME(EqualToken); // "="
    const captured = {};
    $.SUBRULE($.schemaParseObjectFn, {
      ARGS: [
        parent,
        {
          "[string]": {
            "search?": "[query]",
            "hide?": ["[string]"],
            sort: { "[string]": ["asc", "desc", "rand"] },
            id: "[string]",
            "alias?": "[string]",
          },
        },
        captured,
      ],
    });

    // each key is the view name, ensure either search or hide is present
    for (const viewName in captured) {
      if (!captured[viewName].search && !captured[viewName].hide) {
        $.addMissingError(
          parent,
          `view ${viewName} must have either a search or hide criteria`
        );
      }
    }

    $.sectionStack.pop();
  };
}
