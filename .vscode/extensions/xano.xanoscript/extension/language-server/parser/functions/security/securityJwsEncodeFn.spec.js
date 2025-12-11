import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityJwsEncodeFn();
  return parser;
}

describe("securityJwsEncodeFn", () => {
  it("securityJwsEncodeFn accepts attributes and store value in a variable", () => {
    const parser = parse(`jws_encode {
      headers = {}
      claims = {}
      key = ""
      signature_algorithm = "HS256"
      ttl = 0
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
