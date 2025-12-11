export class Iterator {
  constructor(items) {
    this.items = items;
    this.index = 0;
  }

  next() {
    return this.items[this.index++];
  }

  hasNext() {
    return this.index < this.items.length;
  }

  reset() {
    this.index = 0;
  }
}

const schemeByFirstWord = {
  addon: "addon",
  agent: "agent",
  agent_trigger: "agent_trigger",
  api_group: "api_group",
  branch: "branch",
  function: "cfn",
  mcp_server: "mcp_server",
  mcp_server_trigger: "mcp_server_trigger",
  middleware: "middleware",
  query: "api",
  realtime_trigger: "realtime_trigger",
  realtime_channel: "realtime_channel",
  table: "db",
  table_trigger: "table_trigger",
  task: "task",
  tool: "tool",
  workflow_test: "workflow_test",
  workspace: "workspace",
  workspace_trigger: "workspace_trigger",
};

// Matches the first keyword after optional whitespace and comments
// Skips:
// - Whitespace (spaces, tabs, newlines)
// - Comments (// ... until end of line)
const firstWordRegex = /^(?:\s|\/\/[^\n]*\n)*(\w+)/;
/**
 * detects the scheme to used based on the first word of the document
 * @param {string} source The source code of the document
 * @returns {string|undefined} The scheme of the document
 */
export function getSchemeFromContent(source) {
  const firstWord = source.match(firstWordRegex)?.[1];
  return schemeByFirstWord[firstWord] || "cfn";
}
