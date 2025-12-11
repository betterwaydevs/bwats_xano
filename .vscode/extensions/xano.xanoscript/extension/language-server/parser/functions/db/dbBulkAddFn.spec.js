import { expect } from "chai";
import { describe, it, xit } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbBulkAddFn();
  return parser;
}

describe("dbBulkAddFn", () => {
  it("dbBulkAddFn accepts an array of items", () => {
    const parser = parse(`add user {
      items = [{ name: "New Name" }]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkAddFn accepts an as $variable", () => {
    const parser = parse(`add "my users" {
      items = [{ name: "New Name" }]
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkAddFn accepts an empty $items array", () => {
    const parser = parse(`add "my users" {
      items = []
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkAddFn accepts a $items variable", () => {
    const parser = parse(`add "my users" {
      items = $var.userList
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkAddFn accepts a allow_id_field", () => {
    const parser = parse(`add user {
      items = [
        { id: 123, name: "New Name" }
        { id: 321, name: "Another Name" }
      ]
      allow_id_field = true
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
  });

  xit("dbBulkAddFn shows a warning when an ID is used without allow_id_field", () => {
    let parser = parse(`add user {
      items = [
        { id: 123, name: "New Name" }
        { id: 321, name: "Another Name" }
      ]
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.not.be.empty;

    parser = parse(`add user {
      items = [
        { id: 123, name: "New Name" }
        { id: 321, name: "Another Name" }
      ]
      allow_id_field = false
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.not.be.empty;

    parser = parse(`add user {
      items = [
        { id: 123, name: "New Name" }
        { id: 321, name: "Another Name" }
      ]
      allow_id_field = true
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.be.empty;

    parser = parse(`add user {
      items = [
        { id: 123, name: "New Name" }
        { id: 321, name: "Another Name" }
      ]
      allow_id_field = $var.x
    } as $addedCount`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.be.empty;
  });
});
