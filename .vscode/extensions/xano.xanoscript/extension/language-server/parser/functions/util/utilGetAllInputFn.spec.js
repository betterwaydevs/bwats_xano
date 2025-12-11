import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilGetAllInputFn();
  return parser;
}

describe("utilGetAllInputFn", () => {
  it("utilGetAllInputFn can have an empty body", () => {
    const parser = parse(`get_all_input as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetAllInputFn accepts a description", () => {
    const parser = parse(`get_all_input {
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetAllInputFn can be disabled", () => {
    const parser = parse(`get_all_input {
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });
});
