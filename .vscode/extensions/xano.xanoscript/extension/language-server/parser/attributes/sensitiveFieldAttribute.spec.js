import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.sensitiveFieldAttribute();
  return parser;
}

describe("sensitiveFieldAttribute", () => {
  it("sensitiveFieldAttribute accepts a true value", () => {
    const parser = parse("sensitive = true");
    expect(parser.errors).to.be.empty;
  });

  it("sensitiveFieldAttribute accepts a true value", () => {
    const parser = parse("sensitive = false");
    expect(parser.errors).to.be.empty;
  });

  it("sensitiveFieldAttribute rejects anything else", () => {
    const parser = parse("sensitive = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("sensitiveFieldAttribute rejects digit", () => {
    const parser = parse("sensitive = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("sensitiveFieldAttribute can be compact", () => {
    const parser = parse("sensitive=true");
    expect(parser.errors).to.be.empty;
  });
});
