import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayOfStringLiterals();
  return parser;
}

describe("arrayOfStringLiterals", () => {
  it("arrayOfStringLiterals accepts a single string ", () => {
    const parser = parse(`[ "true" ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfStringLiterals can be empty ", () => {
    const parser = parse(`[]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfStringLiterals can be multilines without trailing commas", () => {
    const parser = parse(`[
      "foo"
      "bar"
    ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfStringLiterals can be multilines with trailing commas ", () => {
    const parser = parse(`[
      "foo",
      "bar"
    ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfStringLiterals can be compact ", () => {
    const parser = parse(`["foo","bar"]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfStringLiterals cannot contain a non string ", () => {
    let parser = parse(`[4]`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`[true]`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`["test", 4]`);
    expect(parser.errors).to.not.be.empty;
  });
});
