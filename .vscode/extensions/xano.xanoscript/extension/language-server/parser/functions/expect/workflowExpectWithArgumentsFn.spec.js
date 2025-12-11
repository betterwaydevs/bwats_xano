import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.workflowExpectWithArgumentsFn();
  return parser;
}

describe("workflowExpectWithArgumentsFn", () => {
  // to_equal
  it("workflowExpectWithArgumentsFn to_equal accepts a $var.x variable", () => {
    const parser = parse(`to_equal ($var.x) {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn accepts an $input variable", () => {
    const parser = parse(`to_equal ($input.x) {
      value = 12
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn accepts a filtered variable", () => {
    // foo is not in quotes
    let parser = parse(`to_equal ($x|get:foo:"bar") {
      value = 12
    }`);
    expect(parser.errors).to.not.be.empty;

    // all good, foo is in quotes
    parser = parse(`to_equal ($x|get:"foo":"bar") {
      value = 12
    }`);
    expect(parser.errors).to.be.empty;

    // foo is not in quotes but is in an expression markers
    parser = parse(`to_equal (\`$x|get:foo:"bar"\`) {
      value = 12
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn accepts a description", () => {
    const parser = parse(`to_equal ($foo) {
      value = 12
      description = "This is a description"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn accepts a disabled attribute", () => {
    const parser = parse(`to_equal ($foo) {
      value = 12
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_equal accepts a filter on $variable argument", () => {
    let parser = parse(`to_equal ($variable|get:"foo":"bar") {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;

    parser = parse(`to_equal (\`variable|get:"foo":"bar"\`) {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;

    parser = parse(`to_equal (variable|get:"foo":bar) {
      value = "foo"
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_equal accepts a $variable with a subpath", () => {
    const parser = parse(`to_equal ($variable.x) {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_equal rejects a missing value", () => {
    let parser = parse(`to_equal ($variable) {
    };`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`to_equal ($variable)`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_equal rejects a missing argument", () => {
    const parser = parse(`to_equal {
      value = 10
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  // to_start_with
  it("workflowExpectWithArgumentsFn to_start_with accepts a $variable", () => {
    const parser = parse(`to_start_with ($variable) {
      value = "bar"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_start_with rejects a missing argument", () => {
    const parser = parse(`to_start_with {
      value = "bar"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_start_with rejects a missing value", () => {
    const parser = parse(`to_start_with ($variable) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_start_with accepts subattribute from variable", () => {
    const parser = parse(`to_start_with ($variable.x) {
      value = "bar"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_end_with
  it("workflowExpectWithArgumentsFn to_end_with accepts a $variable variable", () => {
    const parser = parse(`to_end_with ($variable) {
      value = "baz"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_end_with rejects a missing value", () => {
    const parser = parse(`to_end_with ($variable) {
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_end_with rejects a missing argument", () => {
    const parser = parse(`to_end_with {
      value = "baz"
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_end_with does accept subattribute from variable", () => {
    const parser = parse(`to_end_with ($variable.x) {
      value = "baz"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_be_greater_than
  it("workflowExpectWithArgumentsFn to_be_greater_than accepts a $variable variable", () => {
    const parser = parse(`to_be_greater_than ($variable) {
      value = 10
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_greater_than rejects a missing argument", () => {
    const parser = parse(`to_be_greater_than {
      value = 22 + 12
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_greater_than rejects a missing value", () => {
    const parser = parse(`to_be_greater_than ($variable) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_greater_than does accept subattribute from variable", () => {
    const parser = parse(`to_be_greater_than ($variable.x) {
      value = $variable.y + 10
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_be_less_than
  it("workflowExpectWithArgumentsFn to_be_less_than accepts a $variable variable", () => {
    const parser = parse(`to_be_less_than ($variable) {
      value = 10
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_less_than rejects a missing value", () => {
    const parser = parse(`to_be_less_than ($variable) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_less_than rejects a missing argument", () => {
    const parser = parse(`to_be_less_than {
      value = 10
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_be_less_than does accept subattribute from variable", () => {
    const parser = parse(`to_be_less_than ($variable.x) {
      value = $variable.y - 55
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_match
  it("workflowExpectWithArgumentsFn to_match accepts a $variable variable", () => {
    const parser = parse(`to_match ($variable) {
      value = "pattern"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_match rejects a missing argument", () => {
    const parser = parse(`to_match {
      value = $variable
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_match rejects a missing value", () => {
    const parser = parse(`to_match ($variable) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_match does accept subattribute from variable", () => {
    const parser = parse(`to_match ($variable.x) {
      value = "pattern"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_not_equal
  it("workflowExpectWithArgumentsFn to_not_equal accepts a $variable variable", () => {
    const parser = parse(`to_not_equal ($variable) {
      value = "notfoo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_not_equal rejects a missing value", () => {
    const parser = parse(`to_not_equal ($variable) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_not_equal rejects a missing argument", () => {
    const parser = parse(`to_not_equal {
      value = 66
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_not_equal does accept subattribute from variable", () => {
    const parser = parse(`to_not_equal ($variable.x) {
      value = $variable.y
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_contain
  it("workflowExpectWithArgumentsFn to_contain accepts a $variable variable", () => {
    const parser = parse(`to_contain ($variable) {
      value = "needle"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_contain rejects a missing argument", () => {
    const parser = parse(`to_contain {
      value = $variable.x
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_contain rejects a missing value", () => {
    const parser = parse(`to_contain ($variable){
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectWithArgumentsFn to_contain does accept subattribute from variable", () => {
    const parser = parse(`to_contain ($haystack){
      value = "needle"
    }`);
    expect(parser.errors).to.be.empty;
  });
});
