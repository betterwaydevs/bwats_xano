import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.unitExpectToThrowFn();
  return parser;
}

describe("unitExpectToThrowFn", () => {
  it("unitExpectToThrowFn accepts data field", () => {
    const parser = parse(`to_throw {
      exception = "error"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectToThrowFn accepts an empty payload", () => {
    const parser = parse(`to_throw`);
    expect(parser.errors).to.be.empty;
  });

  it("unitExpectToThrowFn does not accept an operand", () => {
    const parser = parse(`to_throw ($response.x) {
      exception = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("unitExpectToThrowFn rejects an expression", () => {
    const parser = parse(`to_throw {
      exception = $var.exception
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
