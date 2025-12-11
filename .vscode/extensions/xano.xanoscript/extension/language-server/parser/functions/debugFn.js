import { DebugToken } from "../../lexer/debug.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function debugFn($) {
  return () => {
    $.sectionStack.push("debug");
    $.CONSUME(DebugToken); // "debug"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.debugLogFn) }, // debug.log
      { ALT: () => $.SUBRULE($.debugStopFn) }, // debug.stop
    ]);
    $.sectionStack.pop();
  };
}
