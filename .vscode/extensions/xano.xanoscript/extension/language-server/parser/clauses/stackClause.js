import { StackToken } from "../../lexer/tokens.js";
import { DEFAULT_OPTIONS } from "./nakedStackFn.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function stackClause($) {
  return (options = {}) => {
    options = { ...DEFAULT_OPTIONS, ...options };

    $.sectionStack.push("stackClause");
    $.CONSUME(StackToken);
    $.OPTION(() => $.SUBRULE($.nakedStackFn, { ARGS: [options] }));
    $.sectionStack.pop();
  };
}
