import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityCreatePasswordFn();
  return parser;
}

describe("securityCreatePasswordFn", () => {
  it("securityCreatePasswordFn accepts attributes and store value in a variable", () => {
    const parser = parse(`create_password {
      character_count = 12
      require_lowercase = true
      require_uppercase = true
      require_digit = true
      require_symbol = false
      symbol_whitelist = ""
    } as $password`);
    expect(parser.errors).to.be.empty;
  });
});
