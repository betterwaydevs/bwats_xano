import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.awaitFn();
  return parser;
}

describe("awaitFn", () => {
  it("awaitFn accepts data field", () => {
    const parser = parse(`await {
      timeout = 10
      ids = []|push:$func1
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("awaitFn can be disabled", () => {
    const parser = parse(`await {
      ids = []|push:$func1
      timeout = 10
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("awaitFn accepts a description", () => {
    const parser = parse(`await {
      description = "await function"
      ids = []|push:$func1
      timeout = 10
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("awaitFn requires a ids field", () => {
    const parser = parse(`await {
      description = "await new user"
      timeout = 10
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
