import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilGetEnvFn();
  return parser;
}

describe("utilGetEnvFn", () => {
  it("utilGetEnvFn can have an empty body", () => {
    const parser = parse(`get_env as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetEnvFn accepts a description", () => {
    const parser = parse(`get_env {
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGetEnvFn can be disabled", () => {
    const parser = parse(`get_env {
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });
});
