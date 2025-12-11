import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.workflowExpectToBeWithinFn();
  return parser;
}

describe("workflowExpectToBeWithinFn", () => {
  it("workflowExpectToBeWithinFn accepts args and a value argument", () => {
    const parser = parse(`to_be_within ($foo) {
        min = 11
        max = 13
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToBeWithinFn accepts a filtered variable", () => {
    const parser = parse(`to_be_within ($var.foo|first) {
      min = 11
      max = 13
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToBeWithinFn accepts a description", () => {
    const parser = parse(`to_be_within ($foo) {
        min = 11
        max = 13
        description = "This is a description"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToBeWithinFn accepts a disabled flag", () => {
    const parser = parse(`to_be_within ($foo) {
        min = 11
        max = 13
        disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToBeWithinFn does not accept a missing min", () => {
    const parser = parse(`to_be_within ($input.x) {
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectToBeWithinFn does not accept a missing max", () => {
    const parser = parse(`to_be_within ($var.foo) {
      min = 11
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectToBeWithinFn does not accept a missing value", () => {
    const parser = parse(`to_be_within {
      min = 11
      max = 13
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
