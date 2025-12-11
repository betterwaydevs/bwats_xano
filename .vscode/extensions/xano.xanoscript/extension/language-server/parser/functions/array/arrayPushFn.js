import { PushToken } from "../../../lexer/arrays.js";

// array.push {
//   value = "test"
// }
export function arrayPushFn($) {
  return () => {
    $.sectionStack.push("arrayPushFn");
    $.CONSUME(PushToken); // "push"
    $.SUBRULE($.variableOnly);
    $.SUBRULE($.arrayValueOnly);
    $.sectionStack.pop();
  };
}
