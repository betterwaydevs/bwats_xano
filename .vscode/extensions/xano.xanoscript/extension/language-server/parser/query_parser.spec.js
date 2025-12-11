import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("query_parser", () => {
  it("should parse a basic query", () => {
    const parser = xanoscriptParser(`query foo verb=GET {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should accept an api_group", () => {
    const parser = xanoscriptParser(`query foo verb=GET {
      api_group = "Authentication";
      
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse accepts a response_type", () => {
    let parser = xanoscriptParser(`query foo verb=GET {

      response_type = "standard"

      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;

    parser = xanoscriptParser(`query foo verb=GET {

      response_type = "stream"

      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a query with slashes", () => {
    const parser = xanoscriptParser(`query "foo/bar" verb=GET {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a string query url", () => {
    const parser = xanoscriptParser(`query "foo/bar" verb=GET {
      input {
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic a query with dynamic params", () => {
    const parser = xanoscriptParser(`query "foo/{user_id}" verb=GET {
      input {
        text user_id filters=trim
      }

      stack {
      }

      response = null
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should accept a test", () => {
    const parser = xanoscriptParser(`query test_expect verb=GET {
  input {
    int a
    int b
  }

  stack {
    var $sum {
      value = $input.a
    }
    math.add $sum {
      value = $input.b
    } 
  }

  response = $sum

  // description goes here
  test "should add two numbers" {
    input = {a: 20, b: 22}

    expect.to_equal ($response) {
      value = 42
    }
  }

  test "another test with input" {
    input = {a: 20, b: 22}

    expect.to_be_greater_than ($response) {
      value = 40
    }
  }
}`);
    expect(parser.errors).to.be.empty;
  });
});
