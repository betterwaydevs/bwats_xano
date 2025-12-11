import { GoogleToken } from "../../../lexer/cloud.js";
import { DotToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function cloudGoogleFn($) {
  return () => {
    $.sectionStack.push("cloudGoogleFn");
    $.CONSUME(GoogleToken); // "google"
    $.CONSUME(DotToken); // "dot"
    $.OR([
      { ALT: () => $.SUBRULE($.cloudStorageFn) }, // "cloud.google.storage"
    ]);

    $.sectionStack.pop();
  };
}
