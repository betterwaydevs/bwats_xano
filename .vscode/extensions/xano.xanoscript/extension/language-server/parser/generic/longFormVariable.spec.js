import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.longFormVariable();
  return parser;
}

describe("longFormVariable", () => {
  it("longFormVariable accepts a property", () => {
    const parser = parse(`$var.property`);
    expect(parser.errors).to.be.empty;
  });

  it("longFormVariable accepts a hash as a property", () => {
    let parser = parse(`$var.["property"]`);
    expect(parser.errors).to.be.empty;

    parser = parse(`$var["property"]`);
    expect(parser.errors).to.be.empty;
  });
});
