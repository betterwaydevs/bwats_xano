import { StreamToken } from "../../lexer/stream.js";
import { DotToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function streamFn($) {
  return () => {
    $.sectionStack.push("stream");
    $.CONSUME(StreamToken); // "stream"
    $.CONSUME(DotToken); // "."
    $.OR([
      { ALT: () => $.SUBRULE($.streamFromCsvFn) }, // from_csv
      { ALT: () => $.SUBRULE($.streamFromJsonlFn) }, // from_jsonl
      { ALT: () => $.SUBRULE($.streamFromRequestFn) }, // from_request
    ]);
    $.sectionStack.pop();
  };
}
