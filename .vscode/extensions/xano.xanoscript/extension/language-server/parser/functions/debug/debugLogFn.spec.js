import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.debugLogFn();
  return parser;
}

describe("debugLogFn", () => {
  it("debugLogFn accepts a value", () => {
    const parser = parse(`log {
      value = "live"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugLogFn can be disabled", () => {
    const parser = parse(`log {
      value = "live"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugLogFn accepts a description", () => {
    const parser = parse(`log {
      value = "live"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugLogFn requires a value", () => {
    const parser = parse(`log {
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
