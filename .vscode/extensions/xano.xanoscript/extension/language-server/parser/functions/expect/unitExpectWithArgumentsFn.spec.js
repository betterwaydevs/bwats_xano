import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.unitExpectWithArgumentsFn();
  return parser;
}

describe("unitExpectWithArgumentsFn", () => {
  // to_equal
  it("unitExpectWithArgumentsFn to_equal accepts a $response variable", () => {
    const parser = parse(`to_equal ($response) {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn does not accept a non response variable", () => {
    const parser = parse(`to_equal ($foo) {
      value = 12  
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  // to_equal
  it("unitExpectWithArgumentsFn to_equal do not accept a filter on $response argument", () => {
    const parser = parse(`to_equal ($response|get:foo:"bar") {
      value = "foo"
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_equal accepts a $response variable with subpath", () => {
    const parser = parse(`to_equal ($response.x) {
      value = "foo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_equal does not accept a missing equals", () => {
    const parser = parse(`to_equal ($response) {
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_equal does not accept a missing value", () => {
    const parser = parse(`to_equal {
      value = 10
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  // to_start_with
  it("unitExpectWithArgumentsFn to_start_with accepts a $response variable", () => {
    const parser = parse(`to_start_with ($response) {
      value = "bar"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_start_with does not accept a missing value", () => {
    const parser = parse(`to_start_with {
      value = "bar"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_start_with does not accept a missing argument", () => {
    const parser = parse(`to_start_with ($response) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_start_with does accept subattribute from response", () => {
    const parser = parse(`to_start_with ($response.x) {
      value = "bar"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_end_with
  it("unitExpectWithArgumentsFn to_end_with accepts a $response variable", () => {
    const parser = parse(`to_end_with ($response) {
      value = "baz"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_end_with does not accept a missing value", () => {
    const parser = parse(`to_end_with ($response) {
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_end_with does not accept a missing argument", () => {
    const parser = parse(`to_end_with {
      value = "baz"
    };`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_end_with does accept subattribute from response", () => {
    const parser = parse(`to_end_with ($response.x) {
      value = "baz"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_be_greater_than
  it("unitExpectWithArgumentsFn to_be_greater_than accepts a $response variable", () => {
    const parser = parse(`to_be_greater_than ($response) {
      value = 10
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_greater_than does not accept a missing argument", () => {
    const parser = parse(`to_be_greater_than {
      value = 22 + 12
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_greater_than does not accept a missing value", () => {
    const parser = parse(`to_be_greater_than ($response) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_greater_than does accept subattribute from response", () => {
    const parser = parse(`to_be_greater_than ($response.x) {
      value = $response.y + 10
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_be_less_than
  it("unitExpectWithArgumentsFn to_be_less_than accepts a $response variable", () => {
    const parser = parse(`to_be_less_than ($response) {
      value = 10
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_less_than does not accept a missing value", () => {
    const parser = parse(`to_be_less_than ($response) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_less_than does not accept a missing argument", () => {
    const parser = parse(`to_be_less_than {
      value = 10
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_be_less_than does accept subattribute from response", () => {
    const parser = parse(`to_be_less_than ($response.x) {
      value = $response.y - 55
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_match
  it("unitExpectWithArgumentsFn to_match accepts a $response variable", () => {
    const parser = parse(`to_match ($response) {
      value = "pattern"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_match does not accept a missing argument", () => {
    const parser = parse(`to_match {
      value = $response
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_match does not accept a missing value", () => {
    const parser = parse(`to_match ($response) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_match does accept subattribute from response", () => {
    const parser = parse(`to_match ($response.x) {
      value = "pattern"
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_not_equal
  it("unitExpectWithArgumentsFn to_not_equal accepts a $response variable", () => {
    const parser = parse(`to_not_equal ($response) {
      value = "notfoo"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_not_equal does not accept a missing value", () => {
    const parser = parse(`to_not_equal ($response) {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_not_equal does not accept a missing argument", () => {
    const parser = parse(`to_not_equal {
      value = 66
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_not_equal does accept subattribute from response", () => {
    const parser = parse(`to_not_equal ($response.x) {
      value = $response.y
    }`);
    expect(parser.errors).to.be.empty;
  });

  // to_contain
  it("unitExpectWithArgumentsFn to_contain accepts a $response variable", () => {
    const parser = parse(`to_contain ($response) {
      value = "needle"
    };`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithArgumentsFn to_contain does not accept a missing argument", () => {
    const parser = parse(`to_contain {
      value = $response.x
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_contain does not accept a missing value", () => {
    const parser = parse(`to_contain ($response){
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithArgumentsFn to_contain does accept subattribute from response", () => {
    const parser = parse(`to_contain ($response.haystack){
      value = "needle"
    }`);
    expect(parser.errors).to.be.empty;
  });
});
