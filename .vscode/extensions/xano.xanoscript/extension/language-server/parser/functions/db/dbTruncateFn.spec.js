import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbTruncateFn();
  return parser;
}

describe("dbTruncateFn", () => {
  it("dbTruncateFn accepts a reset", () => {
    const parser = parse(`truncate user {
      reset = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTruncateFn can be disabled", () => {
    const parser = parse(`truncate user {
      reset = false
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTruncateFn accepts a description", () => {
    const parser = parse(`truncate user {
      reset = true
      description = "get the user's email truncate"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTruncateFn does not require a reset", () => {
    const parser = parse(`truncate user`);
    expect(parser.errors).to.be.empty;
  });
});
