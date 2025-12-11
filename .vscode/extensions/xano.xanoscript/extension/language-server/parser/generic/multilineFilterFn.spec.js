import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.multilineFilterFn();
  return parser;
}

function parseQuery(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.multilineFilterFn({ allowQueryExpression: true });
  return parser;
}

describe("multilineFilterFn", () => {
  it("multilineFilterFn accept valid single line filter", () => {
    const parser = parse(`|add:2`);
    expect(parser.errors).to.be.empty;
  });

  it("multilineFilterFn accept valid multiline filter", () => {
    const parser = parse(`|add:2
      |divide:1`);
    expect(parser.errors).to.be.empty;
  });

  it("multilineFilterFn rejected non-existing filter", () => {
    const parser = parse(`|add:2
      |divider:1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("multilineFilterFn accept valid query filter with allowQueryExpression", () => {
    const parser = parseQuery(`|between:18:65
      |round`);
    expect(parser.errors).to.be.empty;
  });

  it("multilineFilterFn reject invalid query filter with allowQueryExpression", () => {
    const parser = parseQuery(`|sub:10
      |in:[1,2,3]`);
    expect(parser.errors).to.not.be.empty;
  });
});
