import { ViewContentsToken } from "../../../lexer/zip.js";

/**
 * zip.view_contents {
 *   filename = "some_file.zip"
 *   password = "foo bar"
 *   password_encryption = "standard"
 * } as $zip_file
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function zipViewContentsFn($) {
  return () => {
    const requiredAttrs = ["zip"];
    const optionalAttrs = ["description", "disabled", "password"];

    $.sectionStack.push("zipViewContentsFn");
    const fnToken = $.CONSUME(ViewContentsToken); // "view_contents"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
