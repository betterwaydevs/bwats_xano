import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilSetHeaderFn();
  return parser;
}

describe("utilSetHeaderFn", () => {
  it("utilSetHeaderFn accepts a value", () => {
    const parser = parse(`set_header {
      value = "Set-Cookie: sessionId=e8bb43229de9; HttpOnly; Secure; Domain=foo.example.com"
      duplicates = "replace"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSetHeaderFn accepts a description", () => {
    const parser = parse(`set_header {
      value = "Set-Cookie: sessionId=e8bb43229de9; HttpOnly; Secure; Domain=foo.example.com"
      duplicates = "replace"
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSetHeaderFn can be disabled", () => {
    const parser = parse(`set_header {
      value = "Set-Cookie: sessionId=e8bb43229de9; HttpOnly; Secure; Domain=foo.example.com"
      duplicates = "replace"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSetHeaderFn does not accept an output as value", () => {
    const parser = parse(`set_header {
      value = "Set-Cookie: sessionId=e8bb43229de9; HttpOnly; Secure; Domain=foo.example.com"
      duplicates = "replace"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
