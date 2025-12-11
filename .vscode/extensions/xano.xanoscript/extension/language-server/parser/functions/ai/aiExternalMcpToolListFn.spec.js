import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.aiExternalMcpToolListFn();
  return parser;
}

describe("aiExternalMcpToolListFn", () => {
  it("should parse ai.external.mcp.tool.list with required attributes", () => {
    const parser = parse(`list {
      url = "https://www.le_mcp.com/mcp_sse"
      bearer_token = $env.my_secret_key
      connection_type = "sse"
    } as $my_mcp`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with string literals for all fields", () => {
    const parser = parse(`list {
      url = "https://my-mcp-server.com/sse"
      bearer_token = "my-secret-token"
      connection_type = "sse"
    } as $mcp_tools`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with variable expressions", () => {
    const parser = parse(`list {
      url = $input.mcp_url
      bearer_token = $input.token
      connection_type = $input.connection
    } as $tools`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with optional description", () => {
    const parser = parse(`list {
      description = "List MCP tools"
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
    } as $tools`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with disabled flag", () => {
    const parser = parse(`list {
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      disabled = true
    } as $tools`);
    expect(parser.errors).to.be.empty;
  });

  it("should error when missing required url attribute", () => {
    const parser = parse(`list {
      bearer_token = $env.token
      connection_type = "sse"
    } as $tools`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required bearer_token attribute", () => {
    const parser = parse(`list {
      url = "https://mcp.example.com"
      connection_type = "sse"
    } as $tools`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required connection_type attribute", () => {
    const parser = parse(`list {
      url = "https://mcp.example.com"
      bearer_token = $env.token
    } as $tools`);
    expect(parser.errors).to.not.be.empty;
  });
});
