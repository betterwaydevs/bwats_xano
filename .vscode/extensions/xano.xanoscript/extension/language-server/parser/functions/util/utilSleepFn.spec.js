import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilSleepFn();
  return parser;
}

describe("utilSleepFn", () => {
  it("utilSleepFn can have an empty body", () => {
    const parser = parse(`sleep {
      value = 1000  
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSleepFn accepts a description", () => {
    const parser = parse(`sleep {
      value = 1000  
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSleepFn can be disabled", () => {
    const parser = parse(`sleep {
      value = 1000  
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSleepFn requires a value", () => {
    const parser = parse(`sleep {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
