import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudAlgoliaRequestFn();
  return parser;
}

describe("cloudAlgoliaRequestFn", () => {
  it("cloudAlgoliaRequestFn requires values and an return variable", () => {
    const parser = parse(`request {
      application_id = ""
      api_key = ""
      url = ""
      method = "POST"
      payload = {}
    } as $search_request`);
    expect(parser.errors).to.be.empty;
  });

  it("cloudAlgoliaRequestFn requires values and an return variable", () => {
    const parser = parse(`request as $search_request`);
    expect(parser.errors).to.not.be.empty;
  });
});
