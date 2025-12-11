import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityRandomNumberFn();
  return parser;
}

describe("securityRandomNumberFn", () => {
  it("securityRandomNumberFn accepts attributes and store value in a variable", () => {
    const parser = parse(`random_number {
      min = 0
      max = 9007199254740991
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
