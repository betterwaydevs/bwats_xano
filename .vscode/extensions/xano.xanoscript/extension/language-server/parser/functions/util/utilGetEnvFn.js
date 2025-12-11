import { GetEnvToken } from "../../../lexer/util.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilGetEnvFn($) {
  // util.get_env as $x3
  return () => {
    const requiredAttrs = [];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilGetEnvFn");
    const fnToken = $.CONSUME(GetEnvToken); // "get_env"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
