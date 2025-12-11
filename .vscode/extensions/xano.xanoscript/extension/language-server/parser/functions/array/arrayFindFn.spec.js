import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayFindFn();
  return parser;
}

describe("arrayFindFn", () => {
  it("arrayFindFn requires a value and an return value", () => {
    const parser = parse(`find ([1,2,3,4]) if ($this % 2 == 0) {
      description = "Finding even numbers"  
    } as $found`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayFindFn could be a one liner", () => {
    const parser = parse(`find ([1,3,5,7,9]) if ($this > 2) as $found`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayFindFn without condition adds a warning", () => {
    const parser = parse(`find ([1,3,5,7,9]) as $found`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.not.be.empty;
  });

  it("arrayFindFn 'as' is optional", () => {
    const parser = parse(`find ([1,3,5,7,9]) if ($this > 2)`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayFindFn accept multi line value definition", () => {
    const parser = parse(`find ([1,2,3,
      4,5,6]
    ) if ($this < 4) as $found`);
    expect(parser.errors).to.be.empty;
  });
});
