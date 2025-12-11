import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilGetRawInputFn();
  return parser;
}

describe("utilGetRawInputFn", () => {
  it("utilGetRawInputFn accepts an encoding attribute", () => {
    const parser = parse(`get_raw_input {
      encoding = "json"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetRawInputFn encoding attribute is optional", () => {
    const parser = parse(`get_raw_input as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetRawInputFn accepts an exclude_middleware attribute", () => {
    const parser = parse(`get_raw_input {
      encoding = "json"
      exclude_middleware = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetRawInputFn accepts a description", () => {
    const parser = parse(`get_raw_input {
      encoding = "yaml"
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetRawInputFn can be disabled", () => {
    const parser = parse(`get_raw_input {
      encoding = "x-www-form-urlencoded"
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetRawInputFn does not require an output as value", () => {
    const parser = parse(`get_raw_input`);
    expect(parser.errors).to.be.empty;
  });
});
