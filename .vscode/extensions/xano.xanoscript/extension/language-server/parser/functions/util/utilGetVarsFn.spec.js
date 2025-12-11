import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilGetVarsFn();
  return parser;
}

describe("utilGetVarsFn", () => {
  it("utilGetVarsFn can have an empty body", () => {
    const parser = parse(`get_vars as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetVarsFn accepts a description", () => {
    const parser = parse(`get_vars {
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetVarsFn can be disabled", () => {
    const parser = parse(`get_vars {
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });
});
