import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityEncryptFn();
  return parser;
}

describe("securityEncryptFn", () => {
  it("securityEncryptFn accepts attributes and store value in a variable", () => {
    const parser = parse(`encrypt {
      data = ""
      algorithm = "aes-128-cbc"
      key = ""
      iv = ""
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
