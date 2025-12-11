import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.authClause();
  return parser;
}

describe("authClause", () => {
  it("authClause accepts a true value", () => {
    const parser = parse("auth = true");
    expect(parser.errors).to.be.empty;
  });

  it("authClause accepts a true value", () => {
    const parser = parse("auth = false");
    expect(parser.errors).to.be.empty;
  });

  it("authClause rejects anything else", () => {
    const parser = parse("auth = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("authClause rejects digit", () => {
    const parser = parse("auth = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("authClause can be compact", () => {
    const parser = parse("auth=true");
    expect(parser.errors).to.be.empty;
  });
});
