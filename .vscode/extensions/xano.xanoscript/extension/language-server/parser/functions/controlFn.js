import { BreakToken, ContinueToken } from "../../lexer/control.js";

/**
 * all the control functions (conditional, for loops, return...)
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function controlFn($) {
  return (options = {}) => {
    $.OR([
      { ALT: () => $.CONSUME(BreakToken) }, // "break"
      { ALT: () => $.CONSUME(ContinueToken) }, // "continue"
      { ALT: () => $.SUBRULE($.awaitFn) }, // "await"
      { ALT: () => $.SUBRULE($.conditionalFn) }, // "conditional"
      { ALT: () => $.SUBRULE($.forEachFn) }, // "for_each"
      { ALT: () => $.SUBRULE($.forFn) }, // "for"
      { ALT: () => $.SUBRULE($.functionRunFn) }, // "function.run"
      {
        GATE: () => options.allowFunctionCalls,
        ALT: () => $.SUBRULE($.functionCallFn), // "function.call"
      },
      {
        GATE: () => options.allowFunctionCalls,
        ALT: () => $.SUBRULE($.taskCallFn), // "task.call"
      },
      { ALT: () => $.SUBRULE($.groupFn) }, // "group"
      { ALT: () => $.SUBRULE($.returnFn) }, // "return"
      { ALT: () => $.SUBRULE($.switchFn) }, // "switch"
      { ALT: () => $.SUBRULE($.whileFn) }, // "while
      { ALT: () => $.SUBRULE($.throwFn) }, // "throw"
      { ALT: () => $.SUBRULE($.tryCatchFn) }, // "try_catch"
    ]);
    $.sectionStack.pop();
  };
}
