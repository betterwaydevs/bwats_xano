import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayGroupByFn();
  return parser;
}

describe("arrayGroupByFn", () => {
  it("arrayGroupByFn requires a by attribute", () => {
    const parser = parse(`group_by ($user_list) {
      by = $this.region
    } as $user_by_region`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayGroupByFn accepts a description and disabled attribute", () => {
    const parser = parse(`group_by ($user_list) {
      by = $this.gender
      description = "grouping users by gender"
      disabled = true
    } as $user_by_gender`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayGroupByFn accepts filtered values", () => {
    const parser = parse(`group_by ([]
        |push:1
        |push:2
        |push:3
      ) {
        by = $this.gender
      } as $result`);
    expect(parser.errors).to.be.empty;
  });
});
