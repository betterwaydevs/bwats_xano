import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.stringArray();
  return parser;
}

describe("stringArray", () => {
  it("stringArray accepts a single string literal", () => {
    const parser = parse('[ "some string" ]');
    expect(parser.errors).to.be.empty;
  });

  it("stringArray can be compact", () => {
    const parser = parse('["some string"]');
    expect(parser.errors).to.be.empty;
  });

  it("stringArray can be empty", () => {
    const parser = parse("[]");
    expect(parser.errors).to.be.empty;
  });

  it("stringArray accepts multiple string literal", () => {
    const parser = parse('["some string", "another string"]');
    expect(parser.errors).to.be.empty;
  });

  it("stringArray rejects digits", () => {
    const parser = parse("[123.32]");
    expect(parser.errors).to.not.be.empty;
  });

  it("stringArray rejects boolean", () => {
    const parser = parse("[true]");
    expect(parser.errors).to.not.be.empty;
  });

  it("stringArray rejects identifier", () => {
    const parser = parse("[someString]");
    expect(parser.errors).to.not.be.empty;
  });

  it("stringArray accepts a multi-line array", () => {
    const parser = parse(`[
      "some string",
      "another string"
    ]`);
    expect(parser.errors).to.be.empty;
  });
});
