import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.docsFieldAttribute();
  return parser;
}

describe("docsFieldAttribute", () => {
  it("docsFieldAttribute accepts a string literal", () => {
    const parser = parse('docs = "some docs goes here"');
    expect(parser.errors).to.be.empty;
  });

  it("docsFieldAttribute rejects identifier", () => {
    const parser = parse("docs = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("docsFieldAttribute rejects digit", () => {
    const parser = parse("docs = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("docsFieldAttribute can be compact", () => {
    const parser = parse('docs="another docs"');
    expect(parser.errors).to.be.empty;
  });

  it("docsFieldAttribute does not require a new line", () => {
    const parser = parse('docs="some docs"');
    expect(parser.errors).to.be.empty;
  });
});
