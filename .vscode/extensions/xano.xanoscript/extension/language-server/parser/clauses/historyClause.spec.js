import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.historyClause();
  return parser;
}

describe("historyClause", () => {
  it("historyClause can be disabled", () => {
    const parser = parse(`history = false`);
    expect(parser.errors).to.be.empty;
  });

  it("historyClause accepts a limit", () => {
    let parser = parse(`history = 0`);
    expect(parser.errors).to.be.empty;
    parser = parse(`history = 10`);
    expect(parser.errors).to.be.empty;
    parser = parse(`history = 12`);
    expect(parser.errors).to.not.be.empty;
    parser = parse(`history = 100`);
    expect(parser.errors).to.be.empty;
    parser = parse(`history = 1000`);
    expect(parser.errors).to.be.empty;
    parser = parse(`history = 10000`);
    expect(parser.errors).to.be.empty;
    parser = parse(`history = 100000`);
    expect(parser.errors).to.not.be.empty;
  });

  it("historyClause can be inherited", () => {
    const parser = parse(`history = "inherit"`);
    expect(parser.errors).to.be.empty;
  });

  it("historyClause accepts all", () => {
    let parser = parse(`history = "all"`);
    expect(parser.errors).to.be.empty;

    parser = parse(`history = all`);
    expect(parser.errors).to.not.be.empty;
  });

  it("historyClause does not accept a limit that is not a valid number", () => {
    const parser = parse(`history = 1234`);
    expect(parser.errors).to.not.be.empty;
  });
});
