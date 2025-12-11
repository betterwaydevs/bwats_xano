import { S3Token } from "../../../lexer/cloud.js";
import { DotToken as DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudAwsS3Fn($) {
  return () => {
    $.sectionStack.push("cloudAwsS3Fn");
    $.CONSUME(S3Token); // "s3"
    $.CONSUME(DotToken);
    $.OR([
      { ALT: () => $.SUBRULE($.cloudListDirectoryFn) }, // "cloud.aws.s3.list_directory"
      { ALT: () => $.SUBRULE($.cloudSignUrlFn) }, // "cloud.aws.s3.sign_url"
      { ALT: () => $.SUBRULE($.cloudUploadFileFn) }, // "cloud.aws.s3.upload_file"
      { ALT: () => $.SUBRULE($.cloudDeleteFileFn) }, // "cloud.aws.s3.delete_file"
      { ALT: () => $.SUBRULE($.cloudReadFileFn) }, // "cloud.aws.s3.read_file"
      { ALT: () => $.SUBRULE($.cloudGetFileInfoFn) }, // "cloud.aws.s3.get_file_info"
    ]);
    $.sectionStack.pop();
  };
}
