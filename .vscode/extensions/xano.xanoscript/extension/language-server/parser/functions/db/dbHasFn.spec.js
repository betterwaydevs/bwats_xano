import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbHasFn();
  return parser;
}

describe("dbHasFn", () => {
  it("dbHasFn accepts a field_name and field_value", () => {
    const parser = parse(`has user {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbHasFn accepts a string literal for table", () => {
    const parser = parse(`has "my users" {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbHasFn can be disabled", () => {
    const parser = parse(`has user {
      field_name = "email"
      field_value = $input.email
      disabled = true
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbHasFn accepts a description", () => {
    const parser = parse(`has user {
      field_name = "email"
      field_value = $input.email
      description = "check if a user exists"
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbHasFn requires a field_name", () => {
    const parser = parse(`has user {
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbHasFn requires a field_value", () => {
    const parser = parse(`has user {
      field_name = "email"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
