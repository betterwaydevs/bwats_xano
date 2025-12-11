import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.indexClause();
  return parser;
}

describe("indexClause", () => {
  it("indexClause accepts many indices", () => {
    const parser = parse(`index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {type: "btree", field: [{name: "created_at", op: "desc"}]}
    {
      type : "vector"
      field: [{name: "name_vector", op: "vector_ip_ops"}]
    }
  ]`);
    expect(parser.errors).to.be.empty;
  });

  it("indexClause accepts one index", () => {
    const parser = parse(`index = [
    {type: "primary", field: [{name: "id"}]}
  ]`);
    expect(parser.errors).to.be.empty;
  });

  it("indexClause accepts single and multiline indices", () => {
    const parser = parse(`index = [
    {type: "primary", field: [{name: "id"}]}
    {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
    {
      type : "btree"
      field: [
        {name: "meeting_id", op: "asc"}
        {name: "member_id", op: "asc"}
      ]
    }
  ]`);
    expect(parser.errors).to.be.empty;
  });
});
