import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.filterFn();
  return parser;
}

function parseQuery(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.filterFn({ allowQueryExpression: true });
  return parser;
}

describe("filterFn", () => {
  it("filterFn accept valid filter", () => {
    const parser = parse(`|add:2`);
    expect(parser.errors).to.be.empty;
  });

  it("filterFn accept valid chained filter", () => {
    const parser = parse(`|add:2|divide:1`);
    expect(parser.errors).to.be.empty;
  });

  it("filterFn rejected non-existing filter", () => {
    const parser = parse(`|add:2|divider:1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("filterFn accept valid query filter with allowQueryExpression", () => {
    const parser = parseQuery(`|between:18:65`);
    expect(parser.errors).to.be.empty;
  });

  it("filterFn reject invalid query filter with allowQueryExpression", () => {
    const parser = parseQuery(`|in:[1,2,3]`);
    expect(parser.errors).to.not.be.empty;
  });
});
