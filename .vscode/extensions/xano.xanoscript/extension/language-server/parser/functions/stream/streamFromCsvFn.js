import { FromCsvToken } from "../../../lexer/stream.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function streamFromCsvFn($) {
  const requiredAttrs = ["value", "separator", "enclosure", "escape_char"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("streamFromCsv");
    const fnToken = $.CONSUME(FromCsvToken); // from_csv
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
