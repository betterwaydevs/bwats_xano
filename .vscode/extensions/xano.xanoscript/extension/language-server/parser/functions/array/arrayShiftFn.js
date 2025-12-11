import { ShiftToken } from "../../../lexer/arrays.js";

/**
 * array.shift $my_array as $test
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function arrayShiftFn($) {
  return () => {
    $.sectionStack.push("arrayShiftFn");
    $.CONSUME(ShiftToken); // "shift"
    $.SUBRULE($.variableOnly);
    $.SUBRULE($.arrayNoValueAs);
    $.sectionStack.pop();
  };
}
