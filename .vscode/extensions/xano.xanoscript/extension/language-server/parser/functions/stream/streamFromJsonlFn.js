import { FromJsonlToken } from "../../../lexer/stream.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function streamFromJsonlFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];

  return () => {
    $.sectionStack.push("streamFromJsonl");
    const fnToken = $.CONSUME(FromJsonlToken); // from_jsonl
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });

    $.sectionStack.pop();
  };
}
