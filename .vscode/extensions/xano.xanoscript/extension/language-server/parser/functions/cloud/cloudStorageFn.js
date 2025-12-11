import { StorageToken } from "../../../lexer/cloud.js";
import { DotToken as DotToken } from "../../../lexer/tokens.js";

/**
/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudStorageFn($) {
  return () => {
    $.sectionStack.push("cloudStorageFn");
    $.CONSUME(StorageToken); // "storage"
    $.CONSUME(DotToken);
    $.OR([
      { ALT: () => $.SUBRULE($.cloudListDirectoryFn) }, // "cloud.xxx.storage.list_directory"
      { ALT: () => $.SUBRULE($.cloudSignUrlFn) }, // "cloud.xxx.storage.sign_url"
      { ALT: () => $.SUBRULE($.cloudUploadFileFn) }, // "cloud.xxx.storage.upload_file"
      { ALT: () => $.SUBRULE($.cloudDeleteFileFn) }, // "cloud.xxx.storage.delete_file"
      { ALT: () => $.SUBRULE($.cloudReadFileFn) }, // "cloud.xxx.storage.read_file"
      { ALT: () => $.SUBRULE($.cloudGetFileInfoFn) }, // "cloud.xxx.storage.get_file_info"
    ]);
    $.sectionStack.pop();
  };
}
