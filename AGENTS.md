---
applyTo: "**/*.xs" 
---

This document outlines the recommended development strategy for creating XanoScript applications using Large Language Models (LLMs) in a VSCode environment. It emphasizes a structured, phased approach to ensure clarity, modularity, and maintainability while adhering to XanoScript syntax and best practices.

You'll want to work step by step through the phases below, ensuring each is complete before moving to the next. Always reference the relevant XanoScript documentation for syntax and examples, including:

1. Create or Edit Tables: `tables/` directory (see [Table Guideline](./docs/table_guideline.md) and [Table Examples](./docs/table_examples.md)). It's recommended to create tables without cross reference because Xano would reject the creation of table if the table it references does not exist yet. You can then add the relationships after all tables have been created. You can push all your changes invoking the `push_all_changes_to_xano` tool.
2. Create or Edit Functions: `functions/` directory (see [Function Guideline](./docs/function_guideline.md) and [Function Examples](./docs/function_examples.md)). When defining inputs for functions, refer to the [Input Guideline](./docs/input_guideline.md) for proper syntax and best practices.
3. Create or Edit API Endpoints: `apis/` directory (see [API Query Guideline](./docs/api_query_guideline.md) and [API Query Examples](./docs/api_query_examples.md)). When defining inputs for API endpoints, refer to the [Input Guideline](./docs/input_guideline.md) for proper syntax and best practices.
4. Create or Edit Scheduled Tasks: `tasks/` directory (see [Task Guideline](./docs/task_guideline.md) and [Task Examples](./docs/task_examples.md))
5. Ensure Xano backend is in sync with VSCode by pushing changes
6. When writing queries for database operations, refer to the [Database Query Guideline](./docs/db_query_guideline.md) for proper syntax and best practices.

## AI Agent Development

When developing AI agents, follow these steps:

1. **Define Tools**: Specify any tools the agent can use, ensuring they are defined in the `tools/` directory (see [Tool Guideline](./docs/tool_guideline.md) and [Tool Examples](./docs/tool_examples.md)).
2. **Define the Agent**: Create a new agent in the `agents/` directory using the XanoScript syntax (see [Agent Guideline](./docs/agent_guideline.md) and [Agent Examples](./docs/agent_examples.md)).

## AI MCP Server Development

When developing an MCP server (Model Context Protocol) to expose your tools to external clients and AI models, follow these steps:

1. **Define Tools**: Ensure the tools you want to expose are defined in the `tools/` directory (see [Tool Guideline](./docs/tool_guideline.md) and [Tool Examples](./docs/tool_examples.md)).
2. **Define the MCP Server**: Create a new MCP server in the `mcp_servers/` directory using the XanoScript syntax (see [MCP Server Guideline](./docs/mcp_server_guideline.md) and [MCP Server Examples](./docs/mcp_server_examples.md)).

## Frontend Building

Prior to building the frontend, ensure that all the changes have been pushed to the Xano backend (you should ask the user to confirm this). You should first proceed by retrieving the latest API specifications by invoking the `get_xano_api_specifications` tool. This will ensure that your frontend is aligned with the most recent backend configurations. You can then proceed to create or edit static assets in the `static/` directory, see [Frontend Guide](./docs/frontend_guideline.md).

## Additional Guidelines

- **Xanoscript Syntax**: Adhere strictly to XanoScript syntax rules. You can use comments with the `//` symbol, a comment needs to be on it's own line and outside a statement. Refer to the [Xano Tips and Tricks](./docs/tips_and_tricks.md) for details.
- **Expression**: Xano offers a rich set of expressions for data manipulation. Refer to the [Expression Lexicon](./docs/expression_guideline.md) for details. Avoid chaining too many expressions in a single line for readability, instead break them into intermediate variables.
- **Xano Statements**: Familiarize yourself with the available statements in XanoScript by consulting the [Function Lexicon](./docs/functions.md). Use control flow statements like `if`, `foreach`, and `try_catch` to manage logic effectively.
- **User Management**: Most Xano workspaces come with a built-in user auth and user table, avoid recreating these, the user table can be extended with the necessary columns and the the built-in auth functions can be customized accordingly.
- **Building from Loveable**: If the project is being built from a Loveable-generated website, follow the specific strategy outlined in the [Building from Loveable Guide](./docs/build_from_loveable.md).

## MCP Usage (Xano Only)

- Use MCP server `"xano"` as defined in `.cursor/mcp.json`, authenticated via the `XANO_MCP_TOKEN` env var.
- MCP is **only** for:
  - Reading workspace metadata (APIs, functions, tables, schemas) on the **development** workspace.
  - Pushing changes from local XanoScript files to the **development** workspace.

### Allowed MCP actions

- Update existing API endpoints in Xano using the contents of the matching local XanoScript files.
- Update existing functions in Xano using the contents of the matching local XanoScript files.
- Read definitions and schemas to understand current behavior before editing.

### Forbidden MCP actions

- Creating or deleting files in this repo (agents edit existing files only).
- Creating or deleting APIs, functions, tables, or tasks in Xano.
- Any destructive operation (truncate, delete, drop, reset, etc.).
- Any operation on a workspace or branch other than `:development`.
- Any operation that removes or bypasses `?x-data-source=development`.

**Rule:**  
Agents must only update the specific APIs/functions explicitly requested, on the development branch, using development data source, via the `"xano"` MCP server.


## 1. Xano Context

- Backend: **Xano – Atlanticsoft (DEV environment only)**
- Only allowed host:  
  `https://xano.atlanticsoft.co/api:wosIWFpR:development`
- Every request must include:  
  `?x-data-source=development`

---

## 2. Allowed Tools (Strict)

### ✅ Allowed
**Only the Xano MCP Server**, with these tool types:
- Read workspace metadata  
- Read APIs, functions, tables, schemas  
- Update API endpoints  
- Update functions  

### ❌ Forbidden
- Any destructive MCP tool (delete, truncate, drop, wipe, reset, etc.)
- Anything targeting production or another branch

Agents must **never** call a tool that modifies or deletes data.

---

## 3. Authentication

Auth uses environment variables only (never hardcode credentials):
- `TEST_USER_EMAIL`
- `TEST_USER_PASSWORD`

Agents must always:
1. Login using the auth endpoint.
2. Capture the returned token.
3. Use that token in all protected requests.

Example login block:

```hurl
POST https://xano.atlanticsoft.co/api:wosIWFpR:development/auth/login?x-data-source=development
Content-Type: application/json

{
  "email": "{{TEST_USER_EMAIL}}",
  "password": "{{TEST_USER_PASSWORD}}"
}

HTTP 200
jsonpath "$.authToken" exists
capture token jsonpath "$.authToken"
```

## 4. Validation Loop (Lint + Hurl)

When changing Xano logic:

1. Edit the local XanoScript file(s) for the requested API/function.
2. Run:
   ```bash
   npm run lint:xano
   ```
