import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.filterDefinition();
  return parser;
}

describe("filterDefinition", () => {
  it("filterDefinition accepts a filter", () => {
    const parser = parse("filters = lower");
    expect(parser.errors).to.be.empty;
  });

  it("filterDefinition accepts two filters", () => {
    const parser = parse("filters = trim | lower");
    expect(parser.errors).to.be.empty;
  });

  it("filterDefinition accepts a filter with an argument", () => {
    const parser = parse("filters = min : 12");
    expect(parser.errors).to.be.empty;
  });

  it("filterDefinition can be compact", () => {
    const parser = parse("filters=min:12");
    expect(parser.errors).to.be.empty;
  });

  it("filterDefinition accepts multiple filter with arguments", () => {
    const parser = parse("filters=min:12|max:50");
    expect(parser.errors).to.be.empty;
  });

  it("filterDefinition accepts multiple arguments", () => {
    const parser = parse("filters=min:12:50");
    expect(parser.errors).to.be.empty;
  });
});
