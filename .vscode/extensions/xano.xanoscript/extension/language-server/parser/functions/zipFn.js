import { DotToken } from "../../lexer/tokens.js";
import { ZipToken } from "../../lexer/zip.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function zipFn($) {
  return () => {
    $.sectionStack.push("zip");
    $.CONSUME(ZipToken); // "zip"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.zipCreateArchiveFn) }, // "zip.create_archive"
      { ALT: () => $.SUBRULE($.zipAddToArchiveFn) }, // "zip.add_to_archive"
      { ALT: () => $.SUBRULE($.zipDeleteFromArchiveFn) }, // "zip.delete_from_archive"
      { ALT: () => $.SUBRULE($.zipExtractFn) }, // "zip.extract"
      { ALT: () => $.SUBRULE($.zipViewContentsFn) }, // "zip.view_contents"
    ]);
    $.sectionStack.pop();
  };
}
