import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayIntersectionFn();
  return parser;
}

describe("arrayIntersectionFn", () => {
  it("arrayIntersectionFn requires a value and an return value", () => {
    const parser = parse(`intersection ([1,3,5,7,9]) {
      value = [2,4,6,8]
      by = $this
    } as $intersection`);
    expect(parser.errors).to.be.empty;
  });
});
