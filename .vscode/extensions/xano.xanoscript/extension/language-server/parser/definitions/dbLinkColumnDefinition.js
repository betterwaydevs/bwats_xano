import { DblinkToken } from "../../lexer/columns.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function dbLinkColumnDefinition($) {
  return () => {
    $.sectionStack.push("dbLinkColumnDefinition");
    const parentToken = $.CONSUME(DblinkToken); // "dblink"
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parentToken,
        {
          table: "[string]",
          "override?": { "[string]": { hidden: "[boolean]" } },
        },
      ],
    });

    // TODO: find a way to call $.add_input from the table being referenced
    $.sectionStack.pop();
  };
}
