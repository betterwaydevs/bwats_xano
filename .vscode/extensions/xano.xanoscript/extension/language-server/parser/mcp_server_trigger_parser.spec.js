import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("mcp_server_trigger", () => {
  it("should parse a basic mcp_server_trigger with string literal name", () => {
    const parser = xanoscriptParser(`mcp_server_trigger "foo" {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic mcp_server_trigger with identifier name", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse mcp_server_trigger with all optional clauses", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      active = true
      description = "Test description"
      mcp_server = "blah"
      actions = {connection: false}
      tags = ["tag1", "tag2"]

      input {
      }

      stack {
      }

      response = null

      history = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when missing mcp_server clause", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      actions = {connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing input clause", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing stack clause", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing response clause", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse actions with connection true", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse actions with connection false", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when actions is missing connection field", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when actions has duplicate connection field", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true, connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when actions is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}
      actions = {connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse active = true", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      active = true
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse active = false", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      active = false
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when active is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      active = true
      active = false
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when description is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      description = "First"
      description = "Second"
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when history is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null

      history = false
      history = false
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when input is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when mcp_server is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "first"
      mcp_server = "second"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when response is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when stack is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when tags is defined multiple times", () => {
    const parser = xanoscriptParser(`mcp_server_trigger foo {
      mcp_server = "blah"
      actions = {connection: true}
      tags = ["tag1"]
      tags = ["tag2"]

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });
});
