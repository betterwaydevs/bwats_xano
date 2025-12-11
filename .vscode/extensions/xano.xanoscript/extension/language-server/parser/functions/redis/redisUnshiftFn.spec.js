import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisUnshiftFn();
  return parser;
}

describe("redis.unshift", () => {
  it("Check unshift is taking required params", () => {
    const parser = parse(`unshift {
      key = "list"
      value = "zero"
    } as $x6`);
    expect(parser.errors).to.be.empty;
  });

  it("Check unshift is missing required params", () => {
    const parser = parse(`unshift {} as $x6`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check unshift has duplicate attributes", () => {
    const parser = parse(`unshift {
      key = "list"
      key = "another_list"
      value = "zero"
    } as $x6`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check unshift has illegal attributes", () => {
    const parser = parse(`unshift {
      key = "list"
      value = "zero"
      illegalAttr = "value"
    } as $x6`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check unshift with optional description attribute", () => {
    const parser = parse(`unshift {
      key = "list"
      value = "zero"
      description = "This is a description"
    } as $x6`);
    expect(parser.errors).to.be.empty;
  });

  it("Check unshift with optional disabled attribute", () => {
    const parser = parse(`unshift {
      key = "list"
      value = "zero"
      disabled = true
    } as $x6`);
    expect(parser.errors).to.be.empty;
  });

  it("Check unshift with both optional attributes", () => {
    const parser = parse(`unshift {
      key = "list"
      value = "zero"
      description = "This is a description"
      disabled = true
    } as $x6`);
    expect(parser.errors).to.be.empty;
  });
});
