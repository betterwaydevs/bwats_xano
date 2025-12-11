import { CloudToken } from "../../lexer/cloud.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function cloudFn($) {
  return () => {
    $.sectionStack.push("cloud");
    $.CONSUME(CloudToken); // "cloud"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.cloudGoogleFn) }, // "cloud.google"
      { ALT: () => $.SUBRULE($.cloudAwsFn) }, // "cloud.aws"
      { ALT: () => $.SUBRULE($.cloudElasticSearchFn) }, // "cloud.elasticsearch"
      { ALT: () => $.SUBRULE($.cloudAzureFn) }, // "cloud.azure"
      { ALT: () => $.SUBRULE($.cloudAlgoliaFn) }, // "cloud.algolia"
    ]);
    $.sectionStack.pop();
  };
}
