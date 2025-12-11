import { CreateFileResourceToken } from "../../../lexer/storage.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function storageCreateFileResourceFn($) {
  return () => {
    const requiredAttrs = ["filename", "filedata"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("storageCreateFileResourceFn");
    const fnToken = $.CONSUME(CreateFileResourceToken); // "create_file_resource"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
