import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.valuesFieldAttribute();
  return parser;
}

describe("valuesFieldAttribute", () => {
  it("valuesFieldAttribute accepts a string literal", () => {
    const parser = parse('values = [ "some", "values" ]');
    expect(parser.errors).to.be.empty;
  });

  it("valuesFieldAttribute accepts multiple line feeds", () => {
    const parser = parse('values = [ "some", "values" ]');
    expect(parser.errors).to.be.empty;
  });

  it("valuesFieldAttribute rejects identifier", () => {
    const parser = parse("values = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("valuesFieldAttribute rejects digit", () => {
    const parser = parse("values = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("valuesFieldAttribute can be compact", () => {
    const parser = parse('values=["another","description"]');
    expect(parser.errors).to.be.empty;
  });

  it("valuesFieldAttribute does not requires a new line", () => {
    const parser = parse('values = [ "some", "values" ]');
    expect(parser.errors).to.be.empty;
  });
});
