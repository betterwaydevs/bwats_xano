import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.throwFn();
  return parser;
}

describe("throwFn", () => {
  it("throwFn accepts a value", () => {
    const parser = parse(`throw {
      name = "throw error"
      value = "oppsy"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("throwFn can be disabled", () => {
    const parser = parse(`throw {
      name = "throw error"
      value = "oppsy"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("throwFn accepts a description", () => {
    const parser = parse(`throw {
      name = "throw error"
      value = "oppsy"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("throwFn requires a value", () => {
    const parser = parse(`throw {
      name = "throw error"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("throwFn requires a name", () => {
    const parser = parse(`throw {
      value = "oppsy"
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
