import { TemplateToken } from "../../../lexer/util.js";

/**
 * util.template {...} as $x3
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilTemplateFn($) {
  const requiredAttrs = ["value"];
  const optionalAttrs = ["description", "disabled"];
  return () => {
    $.sectionStack.push("utilTemplateFn");
    const fnToken = $.CONSUME(TemplateToken); // "template_engine"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
