import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.shortFormVariable();
  return parser;
}

describe("shortFormVariable", () => {
  it("shortFormVariable accept an identifier", () => {
    const parser = parse("$value");
    expect(parser.errors).to.be.empty;
  });

  it("shortFormVariable can be a double $$", () => {
    const parser = parse("$$");
    expect(parser.errors).to.be.empty;
  });

  it("shortFormVariable cannot start with a number", () => {
    const parser = parse("$1");
    expect(parser.errors).to.not.be.empty;
  });
});
