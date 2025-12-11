import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbTableClause();
  return parser;
}

describe("dbTableClause", () => {
  it("dbTableClause accepts string", () => {
    const parser = parse(`table = "test"`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTableClause doesn't allow empty string with double quotes", () => {
    const parser = parse(`table = ""`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbTableClause doesn't allow empty string with single quotes", () => {
    const parser = parse(`table = ''`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbTableClause only allows strings (not numerical)", () => {
    const parser = parse(`table = '123'`);
    expect(parser.errors).to.not.be.empty;
  });
});
