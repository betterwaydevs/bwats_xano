import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisPushFn();
  return parser;
}

describe("redis.push", () => {
  it("Check push is taking required params", () => {
    const parser = parse(`push {
      key = "list"
      value = "second"
    } as $x5`);
    expect(parser.errors).to.be.empty;
  });

  it("Check push is missing required params", () => {
    const parser = parse(`push {} as $x5`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check push has duplicate attributes", () => {
    const parser = parse(`push {
      key = "list"
      key = "another_list"
    } as $x5`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check push has illegal attributes", () => {
    const parser = parse(`push {
      key = "list"
      illegalAttr = "value"
    } as $x5`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check push with optional description attribute", () => {
    const parser = parse(`push {
      key = "list"
      value = "second"
      description = "This is a description"
    } as $x5`);
    expect(parser.errors).to.be.empty;
  });

  it("Check push with optional disabled attribute", () => {
    const parser = parse(`push {
      key = "list"
      value = "second"
      disabled = true
    } as $x5`);
    expect(parser.errors).to.be.empty;
  });

  it("Check push with both optional attributes", () => {
    const parser = parse(`push {
      key = "list"
      value = "second"
      description = "This is a description"
      disabled = true
    } as $x5`);
    expect(parser.errors).to.be.empty;
  });
});
