import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.disabledFieldAttribute();
  return parser;
}

describe("disabledFieldAttribute", () => {
  it("disabledFieldAttribute accepts a boolean", () => {
    const parser = parse("disabled = true");
    expect(parser.errors).to.be.empty;
  });

  it("disabledFieldAttribute rejects identifier", () => {
    const parser = parse("disabled = something");
    expect(parser.errors).to.not.be.empty;
  });

  it("disabledFieldAttribute rejects digit", () => {
    const parser = parse("disabled = 123");
    expect(parser.errors).to.not.be.empty;
  });

  it("disabledFieldAttribute can be compact", () => {
    const parser = parse('disabled=false"');
    expect(parser.errors).to.be.empty;
  });
});
