import { unitExpectToBeWithinFn } from "./unitExpectToBeWithinFn.js";
import { unitExpectToThrowFn } from "./unitExpectToThrowFn.js";
import { unitExpectWithArgumentsFn } from "./unitExpectWithArgumentsFn.js";
import { unitExpectWithoutArgumentsFn } from "./unitExpectWithoutArgumentsFn.js";
import { workflowExpectToBeWithinFn } from "./workflowExpectToBeWithinFn.js";
import { workflowExpectToThrowFn } from "./workflowExpectToThrowFn.js";
import { workflowExpectWithArgumentsFn } from "./workflowExpectWithArgumentsFn.js";
import { workflowExpectWithoutArgumentsFn } from "./workflowExpectWithoutArgumentsFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.unitExpectWithArgumentsFn = $.RULE(
    "unitExpectWithArgumentsFn",
    unitExpectWithArgumentsFn($)
  );
  $.unitExpectWithoutArgumentsFn = $.RULE(
    "unitExpectWithoutArgumentsFn",
    unitExpectWithoutArgumentsFn($)
  );
  $.unitExpectToThrowFn = $.RULE("unitExpectToThrowFn", unitExpectToThrowFn($));
  $.unitExpectToBeWithinFn = $.RULE(
    "unitExpectToBeWithinFn",
    unitExpectToBeWithinFn($)
  );
  $.workflowExpectWithArgumentsFn = $.RULE(
    "workflowExpectWithArgumentsFn",
    workflowExpectWithArgumentsFn($)
  );
  $.workflowExpectWithoutArgumentsFn = $.RULE(
    "workflowExpectWithoutArgumentsFn",
    workflowExpectWithoutArgumentsFn($)
  );
  $.workflowExpectToThrowFn = $.RULE(
    "workflowExpectToThrowFn",
    workflowExpectToThrowFn($)
  );
  $.workflowExpectToBeWithinFn = $.RULE(
    "workflowExpectToBeWithinFn",
    workflowExpectToBeWithinFn($)
  );
};
