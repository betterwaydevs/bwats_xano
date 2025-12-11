import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisRemoveFn();
  return parser;
}

describe("redis.remove", () => {
  it("Check remove is taking required params", () => {
    const input = `remove {
      key = "list"
      value = "FIRST"
      count = ""
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check remove is missing required params", () => {
    const input = `remove {
      key = "list"
      value = "FIRST"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check remove has duplicate attributes", () => {
    const input = `remove {
      key = "list"
      key = "another_list"
      value = "FIRST"
      count = ""
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check remove has illegal attributes", () => {
    const input = `remove {
      key = "list"
      value = "FIRST"
      count = ""
      illegalAttr = "value"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check remove count attribute works", () => {
    const input = `remove {
      key = "list"
      value = "FIRST"
      count = "1"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });
});
