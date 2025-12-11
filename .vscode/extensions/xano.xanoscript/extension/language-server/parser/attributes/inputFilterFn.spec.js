import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.inputFilterFn();
  return parser;
}

describe("inputFilterFn", () => {
  it("inputFilterFn can reference registered filters", () => {
    const parser = parse("trim");
    expect(parser.errors).to.be.empty;
  });

  it("inputFilterFn accepts an argument", () => {
    const parser = parse("max:12");
    expect(parser.errors).to.be.empty;
  });

  it("inputFilterFn accepts regexp arguments", () => {
    const parser = parse("pattern:/[^213]*/");
    expect(parser.errors).to.be.empty;
  });

  it("inputFilterFn accepts many args", () => {
    const parser = parse("prevent:foo:bar");
    expect(parser.errors).to.be.empty;
  });

  it("inputFilterFn accepts dbo link", () => {
    const parser = parse("@:dbo=12");
    expect(parser.errors).to.be.empty;
  });
});
