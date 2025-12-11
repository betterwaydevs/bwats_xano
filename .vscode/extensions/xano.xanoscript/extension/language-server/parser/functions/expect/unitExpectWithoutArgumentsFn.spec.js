import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.unitExpectWithoutArgumentsFn();
  return parser;
}

describe("unitExpectWithoutArgumentsFn", () => {
  it("unitExpectWithoutArgumentsFn has the expect to_be_true", () => {
    const parser = parse(`to_be_true ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn does not accept a non response variable", () => {
    const parser = parse(`to_be_true ($foo)`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithoutArgumentsFn does not accept a filter on $response argument", () => {
    const parser = parse(`to_be_true ($response.x|get:foo:"bar")`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_false", () => {
    const parser = parse(`to_be_false ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_in_the_past", () => {
    const parser = parse(`to_be_in_the_past ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_in_the_future", () => {
    const parser = parse(`to_be_in_the_future ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_defined", () => {
    const parser = parse(`to_be_defined ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_not_be_defined", () => {
    const parser = parse(`to_not_be_defined ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_null", () => {
    const parser = parse(`to_be_null ($response.x)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_not_be_null", () => {
    const parser = parse(`to_not_be_null ($response)`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectWithoutArgumentsFn has the expect to_be_empty", () => {
    const parser = parse(`to_be_empty ($response.x)`);
    expect(parser.errors).to.be.empty;
  });
});
