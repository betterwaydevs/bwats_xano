import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.valueAttrOnly();
  return parser;
}

describe("valueAttrOnly", () => {
  it("valueAttrOnly requires a value and an return value", () => {
    const parser = parse(`{
      value = "foo"  
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("valueAttrOnly also accept a disabled field", () => {
    const parser = parse(`{
      value = true
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("valueAttrOnly also accept a description field", () => {
    const parser = parse(`{
      value = $var.email
      description = "some description"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("valueAttrOnly also accept a description and a disabled field", () => {
    const parser = parse(`{
      description = "some description"
      value = [1, 2, 3]
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("valueAttrOnly does not accept a return value", () => {
    const parser = parse(`{
      value = $var.email
      description = "some description"
    } as foo`);
    expect(parser.errors).to.not.be.empty;
  });

  it("valueAttrOnly requires a value", () => {
    const parser = parse(`{
      description = "some description"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
