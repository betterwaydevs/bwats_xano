import { addonDeclaration } from "./addon_parser.js";
import { agentDeclaration } from "./agent_parser.js";
import { agentTriggerDeclaration } from "./agent_trigger_parser.js";
import { apiGroupDeclaration } from "./api_group_parser.js";
import { register as register_attributes } from "./attributes/register.js";
import { branchDeclaration } from "./branch_parser.js";
import { register as register_clauses } from "./clauses/register.js";
import { register as register_definitions } from "./definitions/register.js";
import { functionDeclaration } from "./function_parser.js";
import { register as register_functions } from "./functions/register.js";
import { register as register_generic } from "./generic/register.js";
import { mcpServerDeclaration } from "./mcp_server_parser.js";
import { mcpServerTriggerDeclaration } from "./mcp_server_trigger_parser.js";
import { register as register_metadata } from "./metadata/register.js";
import { middlewareDeclaration } from "./middleware_parser.js";
import { queryDeclaration } from "./query_parser.js";
import { realtimeChannelDeclaration } from "./realtime_channel_parser.js";
import { realtimeTriggerDeclaration } from "./realtime_trigger_parser.js";
import { tableDeclaration } from "./table_parser.js";
import { tableTriggerDeclaration } from "./table_trigger_parser.js";
import { taskDeclaration } from "./task_parser.js";
import { toolDeclaration } from "./tool_parser.js";
import { workflowTestDeclaration } from "./workflow_test_parser.js";
import { workspaceDeclaration } from "./workspace_parser.js";
import { workspaceTriggerDeclaration } from "./workspace_trigger_parser.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  register_generic($);
  register_definitions($);
  register_attributes($);
  register_functions($);
  register_metadata($);
  register_clauses($);

  $.addonDeclaration = $.RULE("addonDeclaration", addonDeclaration($));
  $.agentDeclaration = $.RULE("agentDeclaration", agentDeclaration($));
  $.agentTriggerDeclaration = $.RULE(
    "agentTriggerDeclaration",
    agentTriggerDeclaration($)
  );
  $.queryDeclaration = $.RULE("queryDeclaration", queryDeclaration($));
  $.apiGroupDeclaration = $.RULE("apiGroupDeclaration", apiGroupDeclaration($));
  $.branchDeclaration = $.RULE("branchDeclaration", branchDeclaration($));
  $.tableDeclaration = $.RULE("tableDeclaration", tableDeclaration($));
  $.mcpServerDeclaration = $.RULE(
    "mcpServerDeclaration",
    mcpServerDeclaration($)
  );
  $.mcpServerTriggerDeclaration = $.RULE(
    "mcpServerTriggerDeclaration",
    mcpServerTriggerDeclaration($)
  );
  $.middlewareDeclaration = $.RULE(
    "middlewareDeclaration",
    middlewareDeclaration($)
  );
  $.realtimeTriggerDeclaration = $.RULE(
    "realtimeTriggerDeclaration",
    realtimeTriggerDeclaration($)
  );
  $.realtimeChannelDeclaration = $.RULE(
    "realtimeChannelDeclaration",
    realtimeChannelDeclaration($)
  );
  $.tableTriggerDeclaration = $.RULE(
    "tableTriggerDeclaration",
    tableTriggerDeclaration($)
  );
  $.taskDeclaration = $.RULE("taskDeclaration", taskDeclaration($));
  $.toolDeclaration = $.RULE("toolDeclaration", toolDeclaration($));
  $.workflowTestDeclaration = $.RULE(
    "workflowTestDeclaration",
    workflowTestDeclaration($)
  );
  $.workspaceDeclaration = $.RULE(
    "workspaceDeclaration",
    workspaceDeclaration($)
  );
  $.workspaceTriggerDeclaration = $.RULE(
    "workspaceTriggerDeclaration",
    workspaceTriggerDeclaration($)
  );
  $.functionDeclaration = $.RULE("functionDeclaration", functionDeclaration($));
};
