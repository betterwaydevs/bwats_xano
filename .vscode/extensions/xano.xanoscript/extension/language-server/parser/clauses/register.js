import { agentClause } from "./agentClause.js";
import { authClause } from "./authClause.js";
import { cacheClause } from "./cacheClause.js";
import { canonicalClause } from "./canonicalClause.js";
import { channelClause } from "./channelClause.js";
import { dbTableClause } from "./dbTableClause.js";
import { flexibleStringClause } from "./flexibleStringClause.js";
import { historyClause } from "./historyClause.js";
import { indexClause } from "./indexClause.js";
import { inputClause } from "./inputClause.js";
import { mcpServerClause } from "./mcpServerClause.js";
import { middlewareClause } from "./middlewareClause.js";
import { nakedStackFn } from "./nakedStackFn.js";
import { outputClause } from "./outputClause.js";
import { responseClause } from "./responseClause.js";
import { scheduleClause } from "./scheduleClause.js";
import { schemaClause } from "./schemaClause.js";
import { stackClause } from "./stackClause.js";
import { testClause } from "./testClause.js";
import { viewClause } from "./viewClause.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.agentClause = $.RULE("agentClause", agentClause($));
  $.authClause = $.RULE("authClause", authClause($));
  $.cacheClause = $.RULE("cacheClause", cacheClause($));
  $.canonicalClause = $.RULE("canonicalClause", canonicalClause($));
  $.channelClause = $.RULE("channelClause", channelClause($));
  $.dbTableClause = $.RULE("dbTableClause", dbTableClause($));
  $.flexibleStringClause = $.RULE(
    "flexibleStringClause",
    flexibleStringClause($)
  );
  $.historyClause = $.RULE("historyClause", historyClause($));
  $.indexClause = $.RULE("indexClause", indexClause($));
  $.inputClause = $.RULE("inputClause", inputClause($));
  $.outputClause = $.RULE("outputClause", outputClause($));
  $.mcpServerClause = $.RULE("mcpServerClause", mcpServerClause($));
  $.middlewareClause = $.RULE("middlewareClause", middlewareClause($));
  $.nakedStackFn = $.RULE("nakedStackFn", nakedStackFn($));
  $.responseClause = $.RULE("responseClause", responseClause($));
  $.scheduleClause = $.RULE("scheduleClause", scheduleClause($));
  $.schemaClause = $.RULE("schemaClause", schemaClause($));
  $.stackClause = $.RULE("stackClause", stackClause($));
  $.testClause = $.RULE("testClause", testClause($));
  $.viewClause = $.RULE("viewClause", viewClause($));
};
