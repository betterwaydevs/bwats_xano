import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arraySlice();
  return parser;
}

describe("arraySlice", () => {
  // []
  it("arraySlice can define an array slice", () => {
    const parser = parse(`[]`);
    expect(parser.errors).to.be.empty;
  });

  // [1:]
  it("arraySlice can define an array slice with start index", () => {
    const parser = parse(`[1:]`);
    expect(parser.errors).to.be.empty;
  });

  // [:3]
  it("arraySlice can define an array slice with end index", () => {
    const parser = parse(`[:3]`);
    expect(parser.errors).to.be.empty;
  });

  // [1:3]
  it("arraySlice can define an array slice with start and end index", () => {
    const parser = parse(`[1:3]`);
    expect(parser.errors).to.be.empty;
  });

  // cannot be negative
  it("arraySlice cannot define an array slice with negative index", () => {
    const parser = parse(`[-1:]`);
    expect(parser.errors).to.not.be.empty;
  });

  // cannot have end < start
  it("arraySlice cannot define an array slice with end index < start index", () => {
    const parser = parse(`[3:1]`);
    expect(parser.errors).to.not.be.empty;
  });
});
