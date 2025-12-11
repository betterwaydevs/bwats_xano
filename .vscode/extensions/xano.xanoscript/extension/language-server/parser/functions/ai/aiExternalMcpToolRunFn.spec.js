import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.aiExternalMcpToolRunFn();
  return parser;
}

describe("aiExternalMcpToolRunFn", () => {
  it("should parse ai.external.mcp.tool.run with all required attributes", () => {
    const parser = parse(`run {
      url = "http://my_mcp.com/sse"
      bearer_token = $env.my_secret_key
      connection_type = "sse"
      tool = "some_tool"
      args = '{"user_id":123}'
    } as $api_tool_call`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with variable expressions", () => {
    const parser = parse(`run {
      url = $input.mcp_url
      bearer_token = $env.token
      connection_type = $input.conn_type
      tool = "my_tool"
      args = $input.tool_args
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with object args", () => {
    const parser = parse(`run {
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
      args = { user_id: 123, name: "test" }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with optional description", () => {
    const parser = parse(`run {
      description = "Execute MCP tool"
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
      args = "{}"
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with disabled flag", () => {
    const parser = parse(`run {
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
      args = "{}"
      disabled = true
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should error when missing required url", () => {
    const parser = parse(`run {
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
      args = "{}"
    } as $result`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required tool", () => {
    const parser = parse(`run {
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      args = "{}"
    } as $result`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required args", () => {
    const parser = parse(`run {
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
    } as $result`);
    expect(parser.errors).to.not.be.empty;
  });
});
