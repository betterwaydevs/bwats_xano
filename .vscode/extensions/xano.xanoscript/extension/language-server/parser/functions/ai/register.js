import { aiAgentRunFn } from "./aiAgentRunFn.js";
import { aiExternalMcpServerDetailsFn } from "./aiExternalMcpServerDetailsFn.js";
import { aiExternalMcpToolListFn } from "./aiExternalMcpToolListFn.js";
import { aiExternalMcpToolRunFn } from "./aiExternalMcpToolRunFn.js";

/**
 * Registers all the AI parsers in this folder
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.aiAgentRunFn = $.RULE("aiAgentRunFn", aiAgentRunFn($));
  $.aiExternalMcpToolListFn = $.RULE(
    "aiExternalMcpToolListFn",
    aiExternalMcpToolListFn($)
  );
  $.aiExternalMcpToolRunFn = $.RULE(
    "aiExternalMcpToolRunFn",
    aiExternalMcpToolRunFn($)
  );
  $.aiExternalMcpServerDetailsFn = $.RULE(
    "aiExternalMcpServerDetailsFn",
    aiExternalMcpServerDetailsFn($)
  );
};
