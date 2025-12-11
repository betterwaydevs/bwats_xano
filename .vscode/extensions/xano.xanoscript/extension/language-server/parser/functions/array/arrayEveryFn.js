import { EveryToken } from "../../../lexer/arrays.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayEveryFn($) {
  return () => {
    $.sectionStack.push("arrayEveryFn");
    const parent = $.CONSUME(EveryToken); // "every"
    $.SUBRULE($.arrayValueIfAs, { ARGS: [parent] });
    $.sectionStack.pop();
  };
}
