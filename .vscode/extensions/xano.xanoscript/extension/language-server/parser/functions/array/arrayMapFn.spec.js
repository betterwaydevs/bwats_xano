import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayMapFn();
  return parser;
}

describe("arrayMapFn", () => {
  it("arrayMapFn requires a by attribute", () => {
    const parser = parse(`map ([1,3,5,7,9]) {
      by = $this
    } as $map`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayMapFn accepts a description and disabled attribute", () => {
    const parser = parse(`map ([1,3,5,7,9]) {
      by = $this
      description = "mapping array"
      disabled = true
    } as $map`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayMapFn accepts an object for mapping (by)", () => {
    const parser = parse(`map ($json) {
      by = {name: $this.name, gender: $this.gender}
    } as $people`);
    expect(parser.errors).to.be.empty;
  });
});
