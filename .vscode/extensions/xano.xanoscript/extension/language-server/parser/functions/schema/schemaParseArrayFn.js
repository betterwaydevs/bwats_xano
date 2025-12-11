import { first } from "lodash-es";
import { CommaToken, LSquare, RSquare } from "../../../lexer/control.js";
import { NewlineToken } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function schemaParseArrayFn($) {
  return (token, schema, captured = {}) => {
    let needSeparator = false;
    captured.value = [];
    $.CONSUME(LSquare); // "["
    $.MANY1(() => $.CONSUME(NewlineToken));
    $.MANY(() => {
      const localCaptured = {};
      $.SUBRULE($.schemaFn, {
        ARGS: [token, first(schema), localCaptured],
      });
      if (needSeparator) {
        $.addInvalidValueError(
          "Expected a comma, a new line or closing bracket"
        );
      }
      captured.value.push(localCaptured);
      needSeparator = true;
      $.OPTION(() => {
        needSeparator = false;
        return $.CONSUME1(CommaToken);
      });
      $.MANY2(() => {
        needSeparator = false;
        $.CONSUME1(NewlineToken);
      });
    });
    $.CONSUME(RSquare); // "]"
  };
}

/**
 *
 * @param {*} attr
 * @returns
 */
export function schemaExpectArray(attr) {
  if (typeof attr !== "object" || !Array.isArray(attr)) return false;
  return attr.length == 1;
}
