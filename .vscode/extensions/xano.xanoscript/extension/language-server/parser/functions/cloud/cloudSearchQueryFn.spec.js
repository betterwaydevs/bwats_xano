import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudSearchQueryFn();
  return parser;
}

describe("cloudSearchQueryFn", () => {
  it("cloudSearchQueryFn requires values and an return variable", () => {
    const parser = parse(`query {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      index = ""
      payload = {}
      expression = []
      size = 0
      from = 0
      sort = []
      included_fields = []
      return_type = "search"
    } as $search_query`);
    expect(parser.errors).to.be.empty;
  });
});
