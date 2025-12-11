import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisGetFn();
  return parser;
}

describe("redis.get", () => {
  it("Check get is taking required params", () => {
    const parser = parse(`get {
      key = "name"
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check get is missing required params", () => {
    const parser = parse(`get {} as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check get has duplicate attributes", () => {
    const parser = parse(`get {
      key = "name"
      key = "another_name"
    } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check get has illegal attributes", () => {
    const parser = parse(`get {
      key = "name"
      illegalAttr = "value"
    } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check get with optional description attribute", () => {
    const parser = parse(`get {
      key = "name"
      description = "This is a description"
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check get with optional disabled attribute", () => {
    const parser = parse(`get {
      key = "name"
      disabled = true
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check get with both optional attributes", () => {
    const parser = parse(`get {
      key = "name"
      description = "This is a description"
      disabled = true
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });
});
