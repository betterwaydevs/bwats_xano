import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisCountFn();
  return parser;
}

describe("redis.count", () => {
  it("Check count is taking required params", () => {
    const parser = parse(`count {
      key = "list"
    } as $x9`);
    expect(parser.errors).to.be.empty;
  });

  it("Check count is missing required params", () => {
    const parser = parse(`count {} as $x9`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check count has duplicate attributes", () => {
    const parser = parse(`count {
      key = "list"
      key = "another_list"
    } as $x9`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check count has illegal attributes", () => {
    const parser = parse(`count {
      key = "list"
      illegalAttr = "value"
    } as $x9`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check count is having description attribute", () => {
    const parser = parse(`count {
      key = "list"
      description = "A description"
    } as $x9`);
    expect(parser.errors).to.be.empty;
  });

  it("Check count is having disabled attribute", () => {
    const parser = parse(`count {
      key = "list"
      disabled = true
    } as $x9`);
    expect(parser.errors).to.be.empty;
  });
});
