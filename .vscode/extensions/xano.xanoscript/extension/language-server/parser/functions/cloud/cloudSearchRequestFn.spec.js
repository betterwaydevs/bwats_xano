import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudSearchRequestFn();
  return parser;
}

describe("cloudSearchRequestFn", () => {
  it("cloudSearchRequestFn requires values and an return variable", () => {
    const parser = parse(`request {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      method = "GET"
      url = ""
      query = {}
    } as $search_request`);
    expect(parser.errors).to.be.empty;
  });

  it("cloudSearchRequestFn requires values and an return variable", () => {
    const parser = parse(`request as $search_request`);
    expect(parser.errors).to.not.be.empty;
  });
});
