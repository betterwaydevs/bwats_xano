import { ReadFileResourceToken } from "../../../lexer/storage.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function storageReadFileResourceFn($) {
  return () => {
    const requiredAttrs = ["value"];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("storageReadFileResourceFn");
    const fnToken = $.CONSUME(ReadFileResourceToken); // "read_file_resource"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
