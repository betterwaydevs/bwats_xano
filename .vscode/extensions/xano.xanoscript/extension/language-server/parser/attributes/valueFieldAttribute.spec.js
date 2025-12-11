import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.valueFieldAttribute();
  return parser;
}

describe("valueFieldAttribute", () => {
  it("valueFieldAttribute accepts a string literal", () => {
    const parser = parse('value = "some value goes here"');
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute accepts a digit", () => {
    const parser = parse("value = 123");
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute accepts a float", () => {
    const parser = parse("value = 12.3");
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute accepts a boolean", () => {
    const parser = parse("value = false");
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute accepts a variable", () => {
    const parser = parse("value = $variable");
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute can be compact", () => {
    const parser = parse('value="another value"');
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute does not require a new line", () => {
    const parser = parse('value="some value"');
    expect(parser.errors).to.be.empty;
  });

  it("valueFieldAttribute rejects identifier", () => {
    const parser = parse("value = something");
    expect(parser.errors).to.not.be.empty;
  });
});
