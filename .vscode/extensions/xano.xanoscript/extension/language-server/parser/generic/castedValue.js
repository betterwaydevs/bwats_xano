import { CastTokens } from "../../lexer/cast.js";
import { StringLiteral } from "../../lexer/literal.js";

/**
 * represent a casted value, e.g., !int "42"
 * not that we only allow string literals to be casted
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function castedValue($) {
  return () => {
    $.OR(CastTokens.map((token) => ({ ALT: () => $.CONSUME(token) })));
    $.CONSUME(StringLiteral);
  };
}
