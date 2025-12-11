import { AddToArchiveToken } from "../../../lexer/zip.js";

/**
 * zip.add_to_archive {
 *   file = $input.file
 *   filename = ""
 *   zip = $zip_file
 *   password = ""
 *   password_encryption = ""
 * }
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function zipAddToArchiveFn($) {
  return () => {
    const requiredAttrs = ["file", "zip"];
    const optionalAttrs = [
      "description",
      "disabled",
      "password",
      "password_encryption",
      "filename",
    ];

    $.sectionStack.push("zipAddToArchiveFn");
    const fnToken = $.CONSUME(AddToArchiveToken); // "add_to_archive"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
