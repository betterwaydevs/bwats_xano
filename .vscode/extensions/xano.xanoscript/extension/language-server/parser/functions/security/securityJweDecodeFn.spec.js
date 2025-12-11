import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityJweDecodeFn();
  return parser;
}

describe("securityJweDecodeFn", () => {
  it("securityJweDecodeFn accepts attributes and store value in a variable", () => {
    const parser = parse(`jwe_decode {
      token = ""
      key = ""
      check_claims = {}
      key_algorithm = "A256KW"
      content_algorithm = "A256CBC-HS512"
      timeDrift = 0
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
