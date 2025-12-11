import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.allTextWithoutReturnValueFn();
  return parser;
}

function parseFull(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.textFn();
  return parser;
}

describe("allTextWithoutReturnValueFn", () => {
  it("allTextWithoutReturnValueFn accepts a value", () => {
    const parser = parse(`trim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn requires a value", () => {
    const parser = parse(`trim $x1 {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("allTextWithoutReturnValueFn accepts a description", () => {
    const parser = parse(`trim $x1 {
      value = "text"
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can be disabled", () => {
    const parser = parse(`trim $x1 {
      value = "text"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn accepts a long form variable", () => {
    const parser = parse(`trim $var.x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn accepts an attribute for assignment", () => {
    const parser = parse(`trim $x1.bar {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can parse ltrim", () => {
    const parser = parse(`ltrim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can parse rtrim", () => {
    const parser = parse(`rtrim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can parse trim", () => {
    const parser = parse(`trim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can parse prepend", () => {
    const parser = parse(`prepend $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn can parse append", () => {
    const parser = parse(`append $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn doesn't require as $var", () => {
    const parser = parse(`append $x1 {
      value = "text"
    } as $append`);
    expect(parser.errors).to.not.be.empty;
  });

  it("allTextWithoutReturnValueFn works with text. namespace", () => {
    const parser = parseFull(`text.trim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithoutReturnValueFn errors without text. namespace", () => {
    const parser = parseFull(`trim $x1 {
      value = "text"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
