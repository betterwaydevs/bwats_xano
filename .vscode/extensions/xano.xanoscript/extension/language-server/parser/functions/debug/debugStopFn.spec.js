import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.debugStopFn();
  return parser;
}

describe("debugStopFn", () => {
  it("debugStopFn accepts a value", () => {
    const parser = parse(`stop {
      value = "live"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugStopFn can be disabled", () => {
    const parser = parse(`stop {
      value = "live"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugStopFn accepts a description", () => {
    const parser = parse(`stop {
      value = "live"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("debugStopFn requires a value", () => {
    const parser = parse(`stop {
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
