import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.allMathFn();
  return parser;
}

describe("allMathFn", () => {
  it("allMathFn accepts a value", () => {
    const parser = parse(`add $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn requires a value", () => {
    const parser = parse(`add $x1 {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("allMathFn accepts a description", () => {
    const parser = parse(`add $x1 {
      value = $x1
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can be disabled", () => {
    const parser = parse(`add $x1 {
      value = $x1
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn accepts a long form variable", () => {
    const parser = parse(`add $var.x1 {
      value = $x1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn accepts an attribute for assignment", () => {
    const parser = parse(`add $x1.bar {
      value = $x1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can sub", () => {
    const parser = parse(`sub $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can mul", () => {
    const parser = parse(`mul $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can div", () => {
    const parser = parse(`div $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can bitwise.xor", () => {
    const parser = parse(`bitwise.xor $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can bitwise.and", () => {
    const parser = parse(`bitwise.and $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allMathFn can bitwise.or", () => {
    const parser = parse(`bitwise.or $x1 {
      value = 1
    }`);
    expect(parser.errors).to.be.empty;
  });
});
