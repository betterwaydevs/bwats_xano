import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityCreateSecretKeyFn();
  return parser;
}

describe("securityCreateSecretKeyFn", () => {
  it("securityCreateSecretKeyFn accepts attributes and store value in a variable", () => {
    const parser = parse(`create_secret_key {
      bits = 1024
      format = "object"
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
