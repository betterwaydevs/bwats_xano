import { AwsToken } from "../../../lexer/cloud.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAwsFn($) {
  return () => {
    $.sectionStack.push("cloudAwsFn");
    $.CONSUME(AwsToken); // "aws"
    $.CONSUME(DotToken); // "dot"
    $.OR([
      { ALT: () => $.SUBRULE($.cloudAwsS3Fn) }, // "cloud.aws.s3"
      { ALT: () => $.SUBRULE($.cloudAwsOpenSearchFn) }, // "cloud.aws.opensearch"
    ]);

    $.sectionStack.pop();
  };
}
