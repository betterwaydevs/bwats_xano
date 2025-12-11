import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayUnionFn();
  return parser;
}

describe("arrayUnionFn", () => {
  it("arrayUnionFn requires a value and an return value", () => {
    const parser = parse(`union ([1,3,5,7,9]) {
      value = [2,4,6,8]
      by = $this
    } as $union`);
    expect(parser.errors).to.be.empty;
  });
});
