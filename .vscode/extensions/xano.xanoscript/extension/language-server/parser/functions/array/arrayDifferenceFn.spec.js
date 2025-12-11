import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayDifferenceFn();
  return parser;
}

describe("arrayDifferenceFn", () => {
  it("arrayDifferenceFn requires a value and an return value", () => {
    const parser = parse(`difference ([1,3,5,7,9]) {
      value = [2,4,6,8]
      by = $this
    } as $difference`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayDifferenceFn accepts filtered values", () => {
    const parser = parse(`difference ([]
      |push:1
      |push:2
      |push:3
    ) {
      value = [2, 3, 4]
      by = $this + 2
    } as $result`);
    expect(parser.errors).to.be.empty;
  });
});
