import { EqualToken } from "../../lexer/control.js";
import { TagsToken } from "../../lexer/tokens.js";

/**
 * tags = ["active", "inactive"]
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function tagsAttribute($) {
  return () => {
    $.CONSUME(TagsToken); // "tags"
    $.CONSUME(EqualToken); // "="
    $.SUBRULE($.stringArray); // ["active", "inactive"]
  };
}
