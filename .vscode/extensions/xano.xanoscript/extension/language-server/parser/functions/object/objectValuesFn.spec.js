import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.objectValuesFn();
  return parser;
}

describe("objectValuesFn", () => {
  it("objectValuesFn accepts a value", () => {
    const parser = parse(`values {
      value = $my_object
    } as $values`);
    expect(parser.errors).to.be.empty;
  });

  it("objectValuesFn can be disabled", () => {
    const parser = parse(`values {
      value = $my_object
      disabled = true
    } as $values`);
    expect(parser.errors).to.be.empty;
  });

  it("objectValuesFn accept a description", () => {
    const parser = parse(`values {
      value = $my_object
      description = "compressed data"
    } as $values`);
    expect(parser.errors).to.be.empty;
  });

  it("objectValuesFn requires a value", () => {
    const parser = parse(`values {
      description = "compressed data"
    } as $values`);
    expect(parser.errors).to.not.be.empty;
  });
});
