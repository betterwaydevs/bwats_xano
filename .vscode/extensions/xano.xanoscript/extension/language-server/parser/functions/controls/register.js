import { awaitFn } from "./awaitFn.js";
import { conditionalElifFn } from "./conditionalElifFn.js";
import { conditionalElseFn } from "./conditionalElseFn.js";
import { conditionalFn } from "./conditionalFn.js";
import { conditionalIfFn } from "./conditionalIfFn.js";
import { forEachFn } from "./forEachFn.js";
import { forFn } from "./forFn.js";
import { functionCallFn } from "./functionCallFn.js";
import { functionRunFn } from "./functionRunFn.js";
import { groupFn } from "./groupFn.js";
import { preconditionFn } from "./preconditionFn.js";
import { returnFn } from "./returnFn.js";
import { switchCaseFn } from "./switchCaseFn.js";
import { switchDefaultFn } from "./switchDefaultFn.js";
import { switchFn } from "./switchFn.js";
import { taskCallFn } from "./taskCallFn.js";
import { throwFn } from "./throwFn.js";
import { tryCatchFn } from "./tryCatchFn.js";
import { whileFn } from "./whileFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.awaitFn = $.RULE("awaitFn", awaitFn($));
  $.conditionalElifFn = $.RULE("conditionalElifFn", conditionalElifFn($));
  $.conditionalElseFn = $.RULE("conditionalElseFn", conditionalElseFn($));
  $.conditionalFn = $.RULE("conditionalFn", conditionalFn($));
  $.conditionalIfFn = $.RULE("conditionalIfFn", conditionalIfFn($));
  $.forEachFn = $.RULE("forEachFn", forEachFn($));
  $.forFn = $.RULE("forFn", forFn($));
  $.functionRunFn = $.RULE("functionRunFn", functionRunFn($));
  $.functionCallFn = $.RULE("functionCallFn", functionCallFn($));
  $.taskCallFn = $.RULE("taskCallFn", taskCallFn($));
  $.groupFn = $.RULE("groupFn", groupFn($));
  $.preconditionFn = $.RULE("preconditionFn", preconditionFn($));
  $.returnFn = $.RULE("returnFn", returnFn($));
  $.switchCaseFn = $.RULE("switchCaseFn", switchCaseFn($));
  $.switchDefaultFn = $.RULE("switchDefaultFn", switchDefaultFn($));
  $.switchFn = $.RULE("switchFn", switchFn($));
  $.throwFn = $.RULE("throwFn", throwFn($));
  $.tryCatchFn = $.RULE("tryCatchFn", tryCatchFn($));
  $.whileFn = $.RULE("whileFn", whileFn($));
};
