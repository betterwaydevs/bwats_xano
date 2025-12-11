import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.unitExpectFn();
  return parser;
}

describe("unitExpectFn", () => {
  it("unitExpectFn accepts a string literal as value", () => {
    const parser = parse(`expect.to_equal ($response.email) {
      value = "email@example.com"
    }`);
    expect(parser.errors).to.be.empty;
  });
});
