import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.mockAttribute();
  return parser;
}

describe("mock", () => {
  it("mock accepts name and payload", () => {
    const parser = parse(`mock = {
      "should add numbers": 5
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("mock requires an object", () => {
    const parser = parse(`mock = 5`);
    expect(parser.errors).to.not.be.empty;
  });

  it("mock name doesn't need quotes", () => {
    const parser = parse(`mock = {
      foo: 5
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("mock allows single line", () => {
    const parser = parse(`mock = { "should add numbers": 5 }`);
    expect(parser.errors).to.be.empty;
  });

  it("mock allows an expression as a value", () => {
    const parser = parse(`mock = {
      "should add numbers": 5 + 10
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("mock allows a filtered value", () => {
    const parser = parse(`mock = {
      "should add numbers": 5|add:10
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("mock allows an object as a value", () => {
    const parser = parse(`mock = {
      "should add numbers": { "foo": 5, "bar": 10 }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
