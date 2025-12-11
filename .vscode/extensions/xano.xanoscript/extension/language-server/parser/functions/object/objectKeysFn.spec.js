import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.objectKeysFn();
  return parser;
}

describe("objectKeysFn", () => {
  it("objectKeysFn accepts a value", () => {
    const parser = parse(`keys {
      value = $input.my_object
    } as $keys`);
    expect(parser.errors).to.be.empty;
  });

  it("objectKeysFn can be disabled", () => {
    const parser = parse(`keys {
      value = $input.my_object
      disabled = true
    } as $keys`);
    expect(parser.errors).to.be.empty;
  });

  it("objectKeysFn accept a description", () => {
    const parser = parse(`keys {
      value = $input.my_object
      description = "compressed data"
    } as $keys`);
    expect(parser.errors).to.be.empty;
  });

  it("objectKeysFn requires a value", () => {
    const parser = parse(`keys {
      description = "compressed data"
    } as $keys`);
    expect(parser.errors).to.not.be.empty;
  });
});
