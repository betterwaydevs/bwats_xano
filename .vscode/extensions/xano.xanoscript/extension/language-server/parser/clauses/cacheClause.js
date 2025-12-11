import { EqualToken } from "../../lexer/control.js";
import { Cachetoken } from "../../lexer/tokens.js";

/**
 * sets the cache for the query or function
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function cacheClause($) {
  return () => {
    $.sectionStack.push("cacheClause");
    const parent = $.CONSUME(Cachetoken); // "cache"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.objectAttrReq, {
      ARGS: [
        parent,
        ["ttl", "input", "auth", "datasource", "ip"],
        ["headers", "env"],
        {
          types: {
            ttl: "number",
            input: "boolean",
            auth: "boolean",
            datasource: "boolean",
            ip: "boolean",
          },
        },
      ],
    });

    $.sectionStack.pop();
  };
}
