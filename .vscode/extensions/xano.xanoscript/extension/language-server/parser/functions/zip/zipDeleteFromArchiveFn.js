import { DeleteFromArchiveToken } from "../../../lexer/zip.js";

/**
 * zip.delete_from_archive {
 *   filename = "some_file.zip"
 *   zip = $zip_file
 *   password = "foo bar"
 * } as $zip_file
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function zipDeleteFromArchiveFn($) {
  return () => {
    const requiredAttrs = ["filename", "zip"];
    const optionalAttrs = ["description", "disabled", "password"];

    $.sectionStack.push("zipDeleteFromArchiveFn");
    const fnToken = $.CONSUME(DeleteFromArchiveToken); // "delete_from_archive"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
