import { lexDocument } from "../lexer/lexer.js";
import { allTokens } from "../lexer/tokens.js";
import { getSchemeFromContent } from "../utils.js";
import { XanoBaseParser } from "./base_parser.js";

/**
 * Will parse the content of the file based on its scheme (db:/, task:/, api:/...)
 * @param {string} scheme
 * @param {string} text
 * @returns
 */
export function xanoscriptParser(text, scheme) {
  if (!scheme) {
    scheme = getSchemeFromContent(text);
  }
  const lexResult = lexDocument(text);
  parser.input = lexResult.tokens;
  switch (scheme.toLowerCase()) {
    case "addon":
      parser.addonDeclaration();
      return parser;
    case "agent":
      parser.agentDeclaration();
      return parser;
    case "agent_trigger":
      parser.agentTriggerDeclaration();
      return parser;
    case "api":
      parser.queryDeclaration();
      return parser;
    case "api_group":
      parser.apiGroupDeclaration();
      return parser;
    case "branch":
      parser.branchDeclaration();
      return parser;
    case "db":
      parser.tableDeclaration();
      return parser;
    case "mcp_server":
      parser.mcpServerDeclaration();
      return parser;
    case "mcp_server_trigger":
      parser.mcpServerTriggerDeclaration();
      return parser;
    case "middleware":
      parser.middlewareDeclaration();
      return parser;
    case "realtime_trigger":
      parser.realtimeTriggerDeclaration();
      return parser;
    case "realtime_channel":
      parser.realtimeChannelDeclaration();
      return parser;
    case "table_trigger":
      parser.tableTriggerDeclaration();
      return parser;
    case "task":
      parser.taskDeclaration();
      return parser;
    case "tool":
      parser.toolDeclaration();
      return parser;
    case "workflow_test":
      parser.workflowTestDeclaration();
      return parser;
    case "workspace":
      parser.workspaceDeclaration();
      return parser;
    case "workspace_trigger":
      parser.workspaceTriggerDeclaration();
      return parser;
    case "cfn":
    default: // Default to function parser
      parser.functionDeclaration();
      return parser;
  }
}

export class XanoScriptParser extends XanoBaseParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis(); // Validates grammar and prepares parser
  }
}

export const parser = new XanoScriptParser();
