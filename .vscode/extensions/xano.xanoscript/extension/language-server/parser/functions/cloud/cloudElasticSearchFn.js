import { ElasticsearchToken } from "../../../lexer/cloud.js";
import { DotToken as DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudElasticSearchFn($) {
  return () => {
    $.sectionStack.push("cloudElasticSearchFn");
    $.CONSUME(ElasticsearchToken); // "elasticsearch"
    $.CONSUME(DotToken);
    $.OR([
      { ALT: () => $.SUBRULE($.cloudSearchDocumentFn) }, // "cloud.elasticsearch.search"
      { ALT: () => $.SUBRULE($.cloudSearchQueryFn) }, // "cloud.elasticsearch.query"
      { ALT: () => $.SUBRULE($.cloudSearchRequestFn) }, // "cloud.elasticsearch.request"
    ]);
    $.sectionStack.pop();
  };
}
