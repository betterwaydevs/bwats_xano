import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudSearchDocumentFn();
  return parser;
}

describe("cloudSearchDocumentFn", () => {
  it("cloudSearchDocumentFn requires values and an return variable", () => {
    const parser = parse(`document {
      auth_type = "IAM"
      key_id = ""
      access_key = ""
      region = ""
      method = "GET"
      index = ""
      doc_id = ""
      doc = {}
    } as $search_document`);
    expect(parser.errors).to.be.empty;
  });
});
