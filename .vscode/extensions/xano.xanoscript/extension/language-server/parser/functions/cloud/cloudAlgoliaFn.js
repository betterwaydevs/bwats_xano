import { AlgoliaToken } from "../../../lexer/cloud.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAlgoliaFn($) {
  return () => {
    $.sectionStack.push("cloudAlgoliaFn");
    $.CONSUME(AlgoliaToken); // "algolia"
    $.CONSUME(DotToken); // "dot"
    $.OR([
      { ALT: () => $.SUBRULE($.cloudAlgoliaRequestFn) }, // "cloud.algolia.request"
    ]);

    $.sectionStack.pop();
  };
}
