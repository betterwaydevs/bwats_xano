import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.aiExternalMcpServerDetailsFn();
  return parser;
}

describe("aiExternalMcpServerDetailsFn", () => {
  it("should parse ai.external.mcp.server_details with required attributes", () => {
    const parser = parse(`server_details {
      url = "https://my_mcp/sse"
      bearer_token = $env.my_secret_key
      connection_type = "sse"
    } as $my_mcp_details`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with string literals", () => {
    const parser = parse(`server_details {
      url = "https://mcp-server.example.com"
      bearer_token = "my-secret-token"
      connection_type = "sse"
    } as $details`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with variable expressions", () => {
    const parser = parse(`server_details {
      url = $input.server_url
      bearer_token = $env.mcp_token
      connection_type = $input.connection_type
    } as $server_info`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with optional description", () => {
    const parser = parse(`server_details {
      description = "Get MCP server details"
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
    } as $details`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse with disabled flag", () => {
    const parser = parse(`server_details {
      url = "https://mcp.example.com"
      bearer_token = $env.token
      connection_type = "sse"
      disabled = true
    } as $details`);
    expect(parser.errors).to.be.empty;
  });

  it("should error when missing required url", () => {
    const parser = parse(`server_details {
      bearer_token = $env.token
      connection_type = "sse"
    } as $details`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required bearer_token", () => {
    const parser = parse(`server_details {
      url = "https://mcp.example.com"
      connection_type = "sse"
    } as $details`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing required connection_type", () => {
    const parser = parse(`server_details {
      url = "https://mcp.example.com"
      bearer_token = $env.token
    } as $details`);
    expect(parser.errors).to.not.be.empty;
  });
});
