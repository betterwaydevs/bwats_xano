import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbBulkPatchFn();
  return parser;
}

describe("dbBulkPatchFn", () => {
  it("dbBulkPatchFn accepts an array of items", () => {
    const parser = parse(`patch user {
      items = [{ name: "New Name" }]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkPatchFn accepts an as $variable", () => {
    const parser = parse(`patch "my users" {
      items = [{ name: "New Name" }]
    } as $patchedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkPatchFn accepts a variable for $items", () => {
    const parser = parse(`patch "my users" {
      items = $var.userList
    } as $patchedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkPatchFn accepts an empty $items array", () => {
    const parser = parse(`patch "my users" {
      items = []
    } as $patchedCount`);
    expect(parser.errors).to.be.empty;
  });
});
