import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.workflowExpectWithoutArgumentsFn();
  return parser;
}

describe("workflowExpectWithoutArgumentsFn", () => {
  it("workflowExpectWithoutArgumentsFn has the expect to_be_true", () => {
    const parser = parse(`to_be_true ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn accepts an $input variable", () => {
    const parser = parse(`to_be_true ($input.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn accepts a filter on var argument", () => {
    let parser = parse(`to_be_true ($x|get:"foo":"bar")`);
    expect(parser.errors).to.be.empty;

    parser = parse('to_be_true (`$x|get:foo:"bar"`)');
    expect(parser.errors).to.be.empty;

    parser = parse("to_be_true (`$x|get:foo:bar`)");
    expect(parser.errors).to.be.empty;

    parser = parse('to_be_true ($x|get:foo:"bar")');
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn accepts a description", () => {
    const parser = parse(`to_be_false ($x) {
      description = "This is a description"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn can be disabled", () => {
    const parser = parse(`to_be_false ($x) {
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_be_in_the_past", () => {
    const parser = parse(`to_be_in_the_past ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_be_in_the_future", () => {
    const parser = parse(`to_be_in_the_future ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_be_defined", () => {
    const parser = parse(`to_be_defined ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_not_be_defined", () => {
    const parser = parse(`to_not_be_defined ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_be_null", () => {
    const parser = parse(`to_be_null ($var.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_not_be_null", () => {
    const parser = parse(`to_not_be_null ($response)`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithoutArgumentsFn has the expect to_be_empty", () => {
    const parser = parse(`to_be_empty ($var.x)`);
    expect(parser.errors).to.be.empty;
  });
});
