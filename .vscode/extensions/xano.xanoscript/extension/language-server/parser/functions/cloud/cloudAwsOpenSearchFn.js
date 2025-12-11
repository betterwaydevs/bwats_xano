import { OpenSearchToken } from "../../../lexer/cloud.js";
import { DotToken as DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAwsOpenSearchFn($) {
  return () => {
    $.sectionStack.push("cloudAwsOpenSearchFn");
    $.CONSUME(OpenSearchToken); // "opensearch"
    $.CONSUME(DotToken);
    $.OR([
      { ALT: () => $.SUBRULE($.cloudSearchDocumentFn) }, // "cloud.aws.opensearch.search"
      { ALT: () => $.SUBRULE($.cloudSearchQueryFn) }, // "cloud.aws.opensearch.query"
      { ALT: () => $.SUBRULE($.cloudSearchRequestFn) }, // "cloud.aws.opensearch.request"
    ]);
    $.sectionStack.pop();
  };
}
