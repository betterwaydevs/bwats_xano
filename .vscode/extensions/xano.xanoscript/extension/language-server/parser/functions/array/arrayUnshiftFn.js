import { UnshiftToken } from "../../../lexer/arrays.js";

// array.unshift {
//   value = "test"
// }
export function arrayUnshiftFn($) {
  return () => {
    $.sectionStack.push("arrayUnshiftFn");
    $.CONSUME(UnshiftToken); // "unshift"
    $.SUBRULE($.variableOnly);
    $.SUBRULE($.arrayValueOnly);
    $.sectionStack.pop();
  };
}
