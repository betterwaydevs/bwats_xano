import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("mcp_server", () => {
  it("should parse a minimal mcp_server with only required fields", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with string literal name", () => {
    const parser = xanoscriptParser(`mcp_server "My Test Server" {
      canonical = "abc123"
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with identifier name", () => {
    const parser = xanoscriptParser(`mcp_server my_test_server {
      tools = []
      canonical = "abc123"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should fail when tools is missing", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      active = true
    }`);

    expect(parser.errors).to.not.be.empty;
    expect(parser.errors[0].message).to.include("missing tools clause");
  });

  it("should parse mcp_server with active field", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      active = true
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with active = false", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      active = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with description", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      description = "This is a test MCP server"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with docs as single line string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      docs = "This is documentation for the MCP server"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with docs as multiline string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      docs = """
        This is multiline documentation
        for the MCP server
        with multiple lines
      """
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with history clause", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      history = 100
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with minimal history clause", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      history = "inherit"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with instructions as single line string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      instructions = "Follow these instructions carefully"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with instructions as multiline string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      instructions = """
        Step 1: Do this
        Step 2: Do that
        Step 3: Finish up
      """
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with tags", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      tags = ["tag1", "tag2", "tag3"]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with empty tools array", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with single tool", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "my_tool"}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with multiple tools", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [
        {"name": "tool1"},
        {"name": "tool2"},
        {"name": "tool3"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with tool having active field", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "my_tool", "active": true}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with tool having auth field", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "my_tool", "auth": "bearer"}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with tool having all fields", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "my_tool", "active": false, "auth": "oauth"}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with mixed tool configurations", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [
        {"name": "tool1"},
        {"name": "tool2", "active": true},
        {"name": "tool3", "auth": "api_key"},
        {"name": "tool4", "active": false, "auth": "basic"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should fail when tool is missing required name field", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"active": true}]
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should fail when tool has invalid field type for active", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "my_tool", "active": "yes"}]
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse mcp_server with all fields", () => {
    const parser = xanoscriptParser(`mcp_server "Complete Test Server" {
      canonical = "abc123"
      active = true
      description = "A complete test MCP server with all fields"
      docs = """
        This is the documentation for the MCP server.
        It contains multiple lines of helpful information.
      """
      history = 100
      instructions = """
        Follow these detailed instructions:
        1. Initialize the server
        2. Configure settings
        3. Run the server
      """
      tags = ["test", "complete", "mcp"]
      tools = [
        {"name": "tool1", "active": true},
        {"name": "tool2", "auth": "bearer"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with fields in different order", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = [{"name": "my_tool"}]
      tags = ["tag1", "tag2"]
      instructions = "Instructions here"
      history = false
      docs = "Documentation here"
      description = "Server description"
      canonical = "abc123"
      active = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with newlines between fields", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      active = true
      description = "Test server"
      tools = [{"name": "test_tool"}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with multiple newlines", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      active = true

    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should fail when duplicate active field is present", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      active = true
      active = false
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse mcp_server with empty tags array", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      tags = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with single tag", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      tags = ["single"]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with numeric values in tags", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      tags = ["tag1", "tag2", "123", "456"]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with trailing newlines", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
    }


    `);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with leading spaces", () => {
    const parser = xanoscriptParser(`    mcp_server test_server {
      canonical = "abc123"
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with history inherit as false", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = []
      history = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with empty docs string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      docs = ""
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with empty instructions string", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      instructions = ""
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with only canonical and tools", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      tools = [{"name": "tool1"}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with special characters in name", () => {
    const parser = xanoscriptParser(`mcp_server test_server_123 {
      tools = []
      canonical = "abc123"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with complex history configuration", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = "abc123"
      history = 100
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should fail with empty canonical value", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      canonical = ""
      tools = []
    }`);

    expect(parser.errors).to.not.be.empty;
    expect(parser.errors[0].message).to.include("canonical cannot be empty");
  });

  it("should parse mcp_server with multiline docs using triple quotes", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      docs = """
        Line 1
        Line 2
        Line 3
      """
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with multiline instructions using triple quotes", () => {
    const parser = xanoscriptParser(`mcp_server test_server {
      tools = []
      canonical = "abc123"
      instructions = """
        Step 1
        Step 2
        Step 3
      """
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with minimal syntax", () => {
    const parser = xanoscriptParser(`mcp_server s {
      canonical = "x"
      tools = []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server with compact syntax and multiple fields", () => {
    const parser = xanoscriptParser(`mcp_server s {
      canonical = "x"
      active = true
      tools = [{"name": "t"}]
    }`);

    expect(parser.errors).to.be.empty;
  });
});
