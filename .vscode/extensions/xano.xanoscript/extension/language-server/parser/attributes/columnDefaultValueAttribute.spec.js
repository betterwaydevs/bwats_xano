import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.columnDefaultValueAttribute();
  return parser;
}

describe("columnDefaultValueAttribute", () => {
  it("columnDefaultValueAttribute accepts an identifier", () => {
    const parser = parse(`= someVariableName`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute accepts a string literal", () => {
    const parser = parse(`="foo"`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute accepts a boolean", () => {
    const parser = parse(`= true`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute accepts 'now'", () => {
    const parser = parse(`= now`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute accepts a float", () => {
    const parser = parse(`= 3.14`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute accepts a keyword", () => {
    const parser = parse(`= date`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefaultValueAttribute rejects special characters", () => {
    const parser = parse(`= @dbo`);
    expect(parser.errors).to.not.be.empty;
  });
});
