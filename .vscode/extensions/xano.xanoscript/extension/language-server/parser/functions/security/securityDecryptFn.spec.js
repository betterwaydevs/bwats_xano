import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityDecryptFn();
  return parser;
}

describe("securityDecryptFn", () => {
  it("securityDecryptFn accepts attributes and store value in a variable", () => {
    const parser = parse(`decrypt {
      data = ""
      algorithm = "aes-128-cbc"
      key = ""
      iv = ""
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
