import { CreateArchiveToken } from "../../../lexer/zip.js";

/**
 * zip.create_archive {
 *   filename = "some_file.zip"
 *   password = "foo bar"
 *   password_encryption = "standard"
 * } as $zip_file
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function zipCreateArchiveFn($) {
  return () => {
    const requiredAttrs = ["filename"];
    const optionalAttrs = [
      "description",
      "disabled",
      "password",
      "password_encryption",
    ];

    $.sectionStack.push("zipCreateArchiveFn");
    const fnToken = $.CONSUME(CreateArchiveToken); // "create_archive"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
