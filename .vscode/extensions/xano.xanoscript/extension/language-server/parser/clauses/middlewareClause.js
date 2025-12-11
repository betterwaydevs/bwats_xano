import { EqualToken } from "../../lexer/control.js";
import { MiddlewareToken } from "../../lexer/tokens.js";

/**
 * response = $entries
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function middlewareClause($) {
  return () => {
    $.sectionStack.push("middlewareClause");

    const parent = $.CONSUME(MiddlewareToken); // "middleware"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.schemaParseObjectFn, {
      ARGS: [
        parent,
        {
          "pre?": [
            {
              name: "[string]",
              "active?": "[boolean]",
              "required?": "[boolean]",
            },
          ],
          "post?": [
            {
              name: "[string]",
              "active?": "[boolean]",
              "required?": "[boolean]",
            },
          ],
        },
      ],
    });

    $.sectionStack.pop();
  };
}
