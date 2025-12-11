import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("workspace_trigger", () => {
  it("should parse a complete workspace_trigger with all clauses", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true, branch_merge: true, branch_new: true}
      active = true
      description = "Test trigger"
      tags = ["tag1", "tag2"]

      input {
        text message
      }

      stack {
      }

      history = false
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic workspace_trigger with required clauses", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace_trigger with string literal name", () => {
    const parser = xanoscriptParser(`workspace_trigger "my-trigger" {
      actions = {branch_live: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when missing input clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: false}

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error when missing stack clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: false}

      input {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse actions with branch_live only", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse actions with branch_merge only", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_merge: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse actions with both branch_live and branch_merge", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: false, branch_merge: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should not error when actions is empty", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should error when actions has duplicate fields", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true, branch_live: false}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse active attribute with true value", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      active = true

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse active attribute with false value", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      active = false

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse description attribute", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      description = "This is a test trigger"

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse tags attribute", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      tags = ["websocket", "realtime"]

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse history clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}

      input {
      }

      stack {
      }

      history = 100
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should error on duplicate actions clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      actions = {branch_merge: true}

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate active attribute", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      active = true
      active = false

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate description attribute", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      description = "First"
      description = "Second"

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate history clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}

      input {
      }

      stack {
      }

      history = false
      history = false
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate input clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}

      input {
      }

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate stack clause", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}

      input {
      }

      stack {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should error on duplicate tags attribute", () => {
    const parser = xanoscriptParser(`workspace_trigger foo {
      actions = {branch_live: true}
      tags = ["tag1"]
      tags = ["tag2"]

      input {
      }

      stack {
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });
});
