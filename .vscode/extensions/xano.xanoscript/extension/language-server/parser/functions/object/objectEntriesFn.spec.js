import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.objectEntriesFn();
  return parser;
}

describe("objectEntriesFn", () => {
  it("objectEntriesFn accepts a value", () => {
    const parser = parse(`entries {
      value = $var.obj
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("objectEntriesFn can be disabled", () => {
    const parser = parse(`entries {
      value = $var.obj
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("objectEntriesFn accept a description", () => {
    const parser = parse(`entries {
      value = $var.obj
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("objectEntriesFn requires a value", () => {
    const parser = parse(`entries {
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
