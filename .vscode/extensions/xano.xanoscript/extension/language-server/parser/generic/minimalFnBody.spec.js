import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.minimalFnBody();
  return parser;
}

describe("minimalFnBody", () => {
  it("minimalFnBody does not accept a value", () => {
    const parser = parse(`{
      value = "text"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("minimalFnBody accepts a description", () => {
    const parser = parse(`{
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("minimalFnBody can be disabled", () => {
    const parser = parse(`{
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("minimalFnBody can be disabled and have a description", () => {
    const parser = parse(`{
      disabled = true
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("minimalFnBody does not requires a description or disable statement", () => {
    const parser = parse(`{
    }`);
    expect(parser.errors).to.be.empty;
  });
});
