import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("agent_trigger", () => {
  it("should parse a basic agent_trigger", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah";
      actions = {}

      input {
      }

      stack {
      }

      response = null

    }`);
    expect(parser.errors).to.be.empty;
  });

  it("agent_trigger don't accept dynamic params", () => {
    const parser = xanoscriptParser(`agent_trigger foo/{user_id} {
      agent = "blah"
      actions = {connection: false}

      input {
        text user_id filters=trim
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse actions with all required fields", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when actions has a duplicate field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true, connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse agent_trigger with string literal name", () => {
    const parser = xanoscriptParser(`agent_trigger "my-agent-trigger" {
      agent = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when missing agent clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing input clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing stack clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}

      input {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing response clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse with active field set to true", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      active = true
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with active field set to false", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      active = false
      actions = {connection: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with description field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      description = "This is a test agent trigger"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with docs field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      docs = "Documentation for the agent trigger"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with history clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null

      history = "inherit"
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with tags attribute", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}
      tags = ["production", "critical", "agent"]

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse with all optional fields", () => {
    const parser = xanoscriptParser(`agent_trigger comprehensive_agent {
      agent = "comprehensive"
      active = true
      description = "Comprehensive agent trigger example"
      docs = "Full documentation here"
      actions = {connection: false}
      tags = ["test", "comprehensive"]

      input {
        text name
      }

      stack {
      }

      response = "Hello World"

      history = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error with duplicate actions clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
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

  it("should error with duplicate active field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      active = true
      active = false
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with duplicate agent clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "first"
      agent = "second"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with duplicate description field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      description = "First description"
      description = "Second description"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with duplicate docs field", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      docs = "First docs"
      docs = "Second docs"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with duplicate history clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}

      input {
      }

      stack {
      }

      response = null

      history = "inherit"
      history = false
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with duplicate input clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
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

  it("should error with duplicate response clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
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

  it("should error with duplicate stack clause", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
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

  it("should error with duplicate tags attribute", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true}
      tags = ["first"]
      tags = ["second"]

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse with clauses in different order", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      response = null

      stack {
      }

      input {
      }

      agent = "blah"
      actions = {connection: true}
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error with invalid actions type", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: "yes"}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error with unknown field in actions", () => {
    const parser = xanoscriptParser(`agent_trigger foo {
      agent = "blah"
      actions = {connection: true, invalid: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });
});
