import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.aiFn();
  return parser;
}

describe("aiFn", () => {
  it("should parse ai.agent.run statement", () => {
    const parser = parse(`ai.agent.run my_agent {
      args = ""
      allow_tool_execution = true
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.external.mcp.tool.list statement", () => {
    const parser = parse(`ai.external.mcp.tool.list {
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
    } as $tools`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.external.mcp.tool.run statement", () => {
    const parser = parse(`ai.external.mcp.tool.run {
      url = "http://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      tool = "my_tool"
      args = "{}"
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse ai.external.mcp.server_details statement", () => {
    const parser = parse(`ai.external.mcp.server_details {
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
    } as $details`);
    expect(parser.errors).to.be.empty;
  });
});
