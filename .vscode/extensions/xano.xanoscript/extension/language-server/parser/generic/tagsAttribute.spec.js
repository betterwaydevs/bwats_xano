import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.tagsAttribute();
  return parser;
}

describe("tags", () => {
  it("tags accepts a single string literal", () => {
    const parser = parse('tags = [ "some string" ]');
    expect(parser.errors).to.be.empty;
  });

  it("tags can be compact", () => {
    const parser = parse('tags=["some string"]');
    expect(parser.errors).to.be.empty;
  });

  it("tags can be empty", () => {
    const parser = parse("tags = []");
    expect(parser.errors).to.be.empty;
  });

  it("tags accepts multiple string literal", () => {
    const parser = parse('tags = ["some tag", "another tag"]');
    expect(parser.errors).to.be.empty;
  });

  it("tags rejects digits", () => {
    const parser = parse("tags = [123.32]");
    expect(parser.errors).to.not.be.empty;
  });

  it("tags rejects boolean", () => {
    const parser = parse("tags = [true]");
    expect(parser.errors).to.not.be.empty;
  });

  it("tags rejects identifier", () => {
    const parser = parse("tags = [$someString]");
    expect(parser.errors).to.not.be.empty;
  });
});
