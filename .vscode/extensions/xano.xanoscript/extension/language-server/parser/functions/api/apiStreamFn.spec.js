import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.apiStreamFn();
  return parser;
}

describe("apiStreamFn", () => {
  it("apiStreamFn accepts a value", () => {
    const parser = parse(`stream {
      value = "live"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("apiStreamFn can be disabled", () => {
    const parser = parse(`stream {
      value = "live"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("apiStreamFn accepts a description", () => {
    const parser = parse(`stream {
      value = "live"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("apiStreamFn requires a value", () => {
    const parser = parse(`stream {
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
