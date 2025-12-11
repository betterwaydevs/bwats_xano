import { DeleteFileToken } from "../../../lexer/storage.js";
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function storageDeleteFileFn($) {
  return () => {
    const requiredAttrs = ["pathname"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("storageDeleteFileFn");
    const fnToken = $.CONSUME(DeleteFileToken); // "delete_file"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.sectionStack.pop();
  };
}
