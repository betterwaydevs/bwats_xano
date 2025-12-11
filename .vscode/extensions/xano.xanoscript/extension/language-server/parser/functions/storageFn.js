import { StorageToken } from "../../lexer/storage.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function storageFn($) {
  return () => {
    $.sectionStack.push("storage");
    $.CONSUME(StorageToken); // "storage"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.storageCreateAttachmentFn) }, // storage.create_attachment
      { ALT: () => $.SUBRULE($.storageCreateFileResourceFn) }, // storage.create_file_resource
      { ALT: () => $.SUBRULE($.storageCreateImageFn) }, // storage.create_image
      { ALT: () => $.SUBRULE($.storageDeleteFileFn) }, // storage.delete_file
      { ALT: () => $.SUBRULE($.storageReadFileResourceFn) }, // storage.read_file_resource
      { ALT: () => $.SUBRULE($.storageSignPrivateUrlFn) }, // storage.sign_private_url
      { ALT: () => $.SUBRULE($.storageCreateAudioFn) }, // storage.create_audio
      { ALT: () => $.SUBRULE($.storageCreateVideoFn) }, // storage.create_video
    ]);
    $.sectionStack.pop();
  };
}
