import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.unitExpectToBeWithinFn();
  return parser;
}

describe("unitExpectToBeWithinFn", () => {
  it("unitExpectToBeWithinFn accepts args and a value argument", () => {
    const parser = parse(`to_be_within ($response) {
        min = 11
        max = 13
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectToBeWithinFn does not accept a non $response variable", () => {
    const parser = parse(`to_equal ($foo) {
      min = 11
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectToBeWithinFn does not accepts filters on value argument", () => {
    const parser =
      parse(`to_be_within (($response|get:foo:"bar")|first|concat:bar) {
      min = 11
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectToBeWithinFn does not accept a missing min", () => {
    const parser = parse(`to_be_within ($response) {
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectToBeWithinFn does not accept a missing max", () => {
    const parser = parse(`to_be_within ($response) {
      min = 11
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectToBeWithinFn does not accept a missing value", () => {
    const parser = parse(`to_be_within {
      min = 11
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
