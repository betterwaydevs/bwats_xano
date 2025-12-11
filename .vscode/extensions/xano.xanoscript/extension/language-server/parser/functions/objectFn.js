import { ObjectToken } from "../../lexer/object.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * object.entries
 * object.keys
 * object.values
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function objectFn($) {
  return () => {
    $.sectionStack.push("object");
    $.CONSUME(ObjectToken); // "object"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.objectEntriesFn) }, // "object.entries"
      { ALT: () => $.SUBRULE($.objectKeysFn) }, // "object.keys"
      { ALT: () => $.SUBRULE($.objectValuesFn) }, // "object.values"
    ]);
    $.sectionStack.pop();
  };
}
