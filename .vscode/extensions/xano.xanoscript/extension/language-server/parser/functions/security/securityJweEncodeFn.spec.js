import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityJweEncodeFn();
  return parser;
}

describe("securityJweEncodeFn", () => {
  it("securityJweEncodeFn accepts attributes and store value in a variable", () => {
    const parser = parse(`jwe_encode {
      headers = {}
      claims = {}
      key = ""
      key_algorithm = "A256KW"
      content_algorithm = "A256CBC-HS512"
      ttl = 0
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
