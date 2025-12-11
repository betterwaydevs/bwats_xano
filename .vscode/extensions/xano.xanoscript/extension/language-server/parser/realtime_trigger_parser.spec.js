import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("realtime_trigger", () => {
  it("should parse a complete realtime_trigger with all clauses", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true, message: true}
      active = true
      description = "Test trigger"
      tags = ["tag1", "tag2"]

      input {
        text message
      }

      stack {
      }

      response = null

      history = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic realtime_trigger with required clauses", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse realtime_trigger with string literal name", () => {
    const parser = xanoscriptParser(`realtime_trigger "my-trigger" {
      channel = "blah"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when missing channel clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      actions = {join: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing input clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: false}

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing stack clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: false}

      input {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing response clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: false}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse actions with join only", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse actions with message only", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {message: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse actions with both join and message", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: false, message: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should not error when actions is empty", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when actions has duplicate fields", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true, join: false}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse active attribute with true value", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      active = true

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse active attribute with false value", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      active = false

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse description attribute", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      description = "This is a test trigger"

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tags attribute", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      tags = ["websocket", "realtime"]

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse history clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null

      history = 100
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error on duplicate channel clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      channel = "other"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate actions clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      actions = {message: true}

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate active attribute", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      active = true
      active = false

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate description attribute", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
      description = "First"
      description = "Second"

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate history clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

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

  it("should error on duplicate input clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

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

  it("should error on duplicate response clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

      input {
      }

      stack {
      }

      response = null

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate stack clause", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}

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

  it("should error on duplicate tags attribute", () => {
    const parser = xanoscriptParser(`realtime_trigger foo {
      channel = "blah"
      actions = {join: true}
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
