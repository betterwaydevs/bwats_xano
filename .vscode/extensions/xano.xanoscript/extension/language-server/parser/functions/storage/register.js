import { storageCreateAttachmentFn } from "./storageCreateAttachmentFn.js";
import { storageCreateAudioFn } from "./storageCreateAudioFn.js";
import { storageCreateFileResourceFn } from "./storageCreateFileResourceFn.js";
import { storageCreateImageFn } from "./storageCreateImageFn.js";
import { storageCreateVideoFn } from "./storageCreateVideoFn.js";
import { storageDeleteFileFn } from "./storageDeleteFileFn.js";
import { storageReadFileResourceFn } from "./storageReadFileResourceFn.js";
import { storageSignPrivateUrlFn } from "./storageSignPrivateUrlFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.storageCreateAttachmentFn = $.RULE(
    "storageCreateAttachmentFn",
    storageCreateAttachmentFn($)
  );
  $.storageCreateFileResourceFn = $.RULE(
    "storageCreateFileResourceFn",
    storageCreateFileResourceFn($)
  );
  $.storageCreateImageFn = $.RULE(
    "storageCreateImageFn",
    storageCreateImageFn($)
  );
  $.storageDeleteFileFn = $.RULE("storageDeleteFileFn", storageDeleteFileFn($));
  $.storageReadFileResourceFn = $.RULE(
    "storageReadFileResourceFn",
    storageReadFileResourceFn($)
  );
  $.storageSignPrivateUrlFn = $.RULE(
    "storageSignPrivateUrlFn",
    storageSignPrivateUrlFn($)
  );
  $.storageCreateAudioFn = $.RULE(
    "storageCreateAudioFn",
    storageCreateAudioFn($)
  );
  $.storageCreateVideoFn = $.RULE(
    "storageCreateVideoFn",
    storageCreateVideoFn($)
  );
};
