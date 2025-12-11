import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.allTextWithReturnValueFn();
  return parser;
}

describe("allTextWithReturnValueFn", () => {
  it("allTextWithReturnValueFn accepts a value", () => {
    const parser = parse(`starts_with $x1 {
      value = "text"
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn requires a value", () => {
    const parser = parse(`starts_with $x1 {
      description = "foo"
    } as $starts_with`);
    expect(parser.errors).to.not.be.empty;
  });

  it("allTextWithReturnValueFn accepts a description", () => {
    const parser = parse(`starts_with $x1 {
      value = "text"
      description = "foo"
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can be disabled", () => {
    const parser = parse(`starts_with $x1 {
      value = "text"
      disabled = true
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn accepts a long form variable", () => {
    const parser = parse(`starts_with $var.x1 {
      value = "text"
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn accepts an attribute for assignment", () => {
    const parser = parse(`starts_with $x1.bar {
      value = "text"
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse starts_with", () => {
    const parser = parse(`starts_with $x1 {
      value = "text"
    } as $starts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse ends_with", () => {
    const parser = parse(`ends_with $x1 {
      value = "text"
    } as $ends_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse contains", () => {
    const parser = parse(`contains $x1 {
      value = "text"
    } as $contains`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse istarts_with", () => {
    const parser = parse(`istarts_with $x1 {
      value = "text"
    } as $istarts_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse iends_with", () => {
    const parser = parse(`iends_with $x1 {
      value = "text"
    } as $iends_with`);
    expect(parser.errors).to.be.empty;
  });

  it("allTextWithReturnValueFn can parse icontains", () => {
    const parser = parse(`icontains $x1 {
      value = "text"
    } as $icontains`);
    expect(parser.errors).to.be.empty;
  });
});
