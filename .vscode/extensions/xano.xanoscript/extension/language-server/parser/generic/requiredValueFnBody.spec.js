import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.requiredValueFnBody();
  return parser;
}

describe("requiredValueFnBody", () => {
  it("requiredValueFnBody accepts a value", () => {
    const parser = parse(`{
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requiredValueFnBody accepts a description", () => {
    const parser = parse(`{
      value = "text"
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requiredValueFnBody can be disabled", () => {
    const parser = parse(`{
      value = "text"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requiredValueFnBody accepts a long form variable", () => {
    const parser = parse(`{
      value = $var.x1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requiredValueFnBody accepts a long form variable with property", () => {
    const parser = parse(`{
      value = $var.x1[0].foo
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requiredValueFnBody requires a value", () => {
    const parser = parse(`{
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
