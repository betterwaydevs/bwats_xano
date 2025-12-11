import { TextToken } from "../../lexer/columns.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function textFn($) {
  return () => {
    $.sectionStack.push("text");
    $.CONSUME(TextToken); // "text"
    $.CONSUME(DotToken); // "."
    const nextToken = $.LA(1).image; // Get the next token
    // Group 1: Functions related to text searching and matching, these functions return a value
    const group1 = [
      "contains",
      "ends_with",
      "icontains",
      "iends_with",
      "istarts_with",
      "starts_with",
    ];

    // Group 2: Functions related to text manipulation, these functions do not return a value
    const group2 = ["append", "ltrim", "prepend", "rtrim", "trim"];

    if (group1.includes(nextToken)) {
      $.SUBRULE($.allTextWithReturnValueFn);
    } else if (group2.includes(nextToken)) {
      $.SUBRULE($.allTextWithoutReturnValueFn);
    }
    $.sectionStack.pop();
  };
}
