import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.castedValue();
  return parser;
}

describe("castedValue", () => {
  it("castedValue can be empty", () => {
    const parser = parse('!int ""');
    expect(parser.errors).to.be.empty;
  });

  it("castedValue can be a string with new lines", () => {
    const parser = parse(
      '!text "[\\n  1,\\n  2,\\n  3,\\n  4,\\n  5,\\n  6,\\n  6\\n]"'
    );
    expect(parser.errors).to.be.empty;
  });

  it("castedValue an array value", () => {
    const parser = parse('!array "[]"');
    expect(parser.errors).to.be.empty;
  });
});
