import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayPartitionFn();
  return parser;
}

describe("arrayPartitionFn", () => {
  it("arrayPartitionFn requires a by attribute", () => {
    const parser = parse(
      `partition ($json) if ($this.gender == "male") as $is_male`
    );
    expect(parser.errors).to.be.empty;
  });

  it("arrayPartitionFn accepts a description and disabled attribute", () => {
    const parser = parse(`partition ([1,3,5,7,9]) if ($this % 2 == 1) {
      description = "partitioning array"
      disabled = true
    } as $partition`);
    expect(parser.errors).to.be.empty;
  });
});
