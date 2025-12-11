import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.canonicalClause();
  return parser;
}

describe("canonicalClause", () => {
  it("canonicalClause accepts string", () => {
    const parser = parse(`canonical = "test"`);
    expect(parser.errors).to.be.empty;
  });

  it("canonicalClause doesn't allow empty string with double quotes", () => {
    const parser = parse(`canonical = ""`);
    expect(parser.errors).to.not.be.empty;
  });

  it("canonicalClause doesn't allow empty string with single quotes", () => {
    const parser = parse(`canonical = ''`);
    expect(parser.errors).to.not.be.empty;
  });

  it("canonicalClause only allows strings (not numerical)", () => {
    const parser = parse(`canonical = '123'`);
    expect(parser.errors).to.not.be.empty;
  });
});
