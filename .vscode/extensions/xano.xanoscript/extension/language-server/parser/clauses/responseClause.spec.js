import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.responseClause();
  return parser;
}

describe("responseClause", () => {
  it("responseClause accepts a variable value", () => {
    const parser = parse(`response = $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("responseClause accepts a variable value with a filter", () => {
    const parser = parse(`response = $x1|trim`);
    expect(parser.errors).to.be.empty;
  });

  it("responseClause accepts a boolean value", () => {
    const parser = parse(`response = true`);
    expect(parser.errors).to.be.empty;
  });

  it("responseClause accepts an object", () => {
    const parser = parse(`response = {result1: $x1, x2: $x2}`);
    expect(parser.errors).to.be.empty;
  });

  it("responseClause accepts multiple line object", () => {
    const parser = parse(`response = {
      result1: $x1
      x2: $x2
    }`);
    expect(parser.errors).to.be.empty;
  });
});
