import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.agentClause();
  return parser;
}

describe("agentClause", () => {
  it("agentClause accepts string", () => {
    const parser = parse(`agent = "test"`);
    expect(parser.errors).to.be.empty;
  });

  it("agentClause doesn't allow empty string with double quotes", () => {
    const parser = parse(`agent = ""`);
    expect(parser.errors).to.not.be.empty;
  });

  it("agentClause doesn't allow empty string with single quotes", () => {
    const parser = parse(`agent = ''`);
    expect(parser.errors).to.not.be.empty;
  });

  it("agentClause only allows strings (not numerical)", () => {
    const parser = parse(`agent = '123'`);
    expect(parser.errors).to.not.be.empty;
  });
});
