import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.descriptionFieldAttribute();
  return parser;
}

describe("descriptionFieldAttribute", () => {
  it("descriptionFieldAttribute accepts a string literal", () => {
    const parser = parse('description = "some description goes here"');
    expect(parser.errors).to.be.empty;
  });

  it("descriptionFieldAttribute rejects identifier", () => {
    const parser = parse("description = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("descriptionFieldAttribute rejects digit", () => {
    const parser = parse("description = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("descriptionFieldAttribute can be compact", () => {
    const parser = parse('description="another description"');
    expect(parser.errors).to.be.empty;
  });

  it("descriptionFieldAttribute does not require a new line", () => {
    const parser = parse('description="some description"');
    expect(parser.errors).to.be.empty;
  });
});
