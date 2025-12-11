import { ExtractToken } from "../../../lexer/zip.js";

/**
 * zip.extract {
 *   zip = $zip_file
 *   password = "foo bar"
 * } as $zip_content
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function zipExtractFn($) {
  return () => {
    const requiredAttrs = ["zip"];
    const optionalAttrs = ["description", "disabled", "password"];

    $.sectionStack.push("zipExtractFn");
    const fnToken = $.CONSUME(ExtractToken); // "extract"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
