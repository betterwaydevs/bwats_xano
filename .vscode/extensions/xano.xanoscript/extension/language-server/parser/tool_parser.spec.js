import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("tool_parser", () => {
  it("should parse a basic tool", () => {
    const parser = xanoscriptParser(`tool foo {
      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a string tool url", () => {
    const parser = xanoscriptParser(`tool "foo/bar" {
      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("tool don't accept dynamic params", () => {
    const parser = xanoscriptParser(`tool foo/{user_id} {
      input {
        text user_id filters=trim
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse a tool with instructions as a string", () => {
    const parser = xanoscriptParser(`tool foo {
      instructions = "This tool does something"

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a tool with instructions as a multiline string", () => {
    const parser = xanoscriptParser(`tool foo {
      instructions = """
        This tool does multiple things:
        - First thing
        - Second thing
      """

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should parse a tool with multiple clauses including instructions", () => {
    const parser = xanoscriptParser(`tool foo {
      description = "A test tool"
      instructions = "Follow these instructions"

      input {
        text param
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });
});
