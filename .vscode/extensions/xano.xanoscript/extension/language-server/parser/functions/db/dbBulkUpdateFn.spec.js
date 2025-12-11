import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbBulkUpdateFn();
  return parser;
}

describe("dbBulkUpdateFn", () => {
  it("dbBulkUpdateFn accepts an array of items", () => {
    const parser = parse(`update user {
      items = [{ name: "New Name" }]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkUpdateFn accepts an as $variable", () => {
    const parser = parse(`update "my users" {
      items = [{ name: "New Name" }]
    } as $updatedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkUpdateFn accepts a variable for $items", () => {
    const parser = parse(`update "my users" {
      items = $var.userList
    } as $updatedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkUpdateFn accepts an empty $items array", () => {
    const parser = parse(`update "my users" {
      items = []
    } as $updatedCount`);
    expect(parser.errors).to.be.empty;
  });
});
