import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.returnFn();
  return parser;
}

describe("returnFn", () => {
  it("returnFn accepts a value", () => {
    const parser = parse(`return {
      value = "live"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("returnFn can be disabled", () => {
    const parser = parse(`return {
      value = "live"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("returnFn accepts a description", () => {
    const parser = parse(`return {
      value = "live"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("returnFn requires a value", () => {
    const parser = parse(`return {
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
