import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("function_parser", () => {
  it("should parse a basic function", () => {
    const parser = xanoscriptParser(`function foo {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a function with a test", () => {
    const parser = xanoscriptParser(`function foo {
      input {
      }

      stack {
      }

      response = null

      // test cases
      test "testset " {
        input = {
          adoption_application_id: ""
          user_id                : ""
          completed_only         : ""
          scheduled_only         : ""
          page                   : ""
          per_page               : ""
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a function with slashes", () => {
    const parser = xanoscriptParser(`function "foo/bar" {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a string function url", () => {
    const parser = xanoscriptParser(`function "foo/bar" {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("function don't accept dynamic params", () => {
    const parser = xanoscriptParser(`function foo/{user_id} {
      input {
        text user_id filters=trim
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
