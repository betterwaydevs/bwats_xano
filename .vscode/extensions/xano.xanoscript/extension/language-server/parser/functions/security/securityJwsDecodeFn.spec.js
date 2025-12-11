import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityJwsDecodeFn();
  return parser;
}

describe("securityJwsDecodeFn", () => {
  it("securityJwsDecodeFn accepts attributes and store value in a variable", () => {
    const parser = parse(`jws_decode {
      token = ""
      key = ""
      check_claims = {}
      signature_algorithm = "HS256"
      timeDrift = 0
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
