import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbDelFn();
  return parser;
}

describe("dbDelFn", () => {
  it("dbDelFn accepts a field_name and field_value", () => {
    const parser = parse(`del user {
      field_name = "email"
      field_value = $input.email
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDelFn accepts a string literal for table", () => {
    const parser = parse(`del "my users" {
      field_name = "email"
      field_value = $input.email
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDelFn can be disabled", () => {
    const parser = parse(`del user {
      field_name = "email"
      field_value = $input.email
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDelFn accepts a description", () => {
    const parser = parse(`del user {
      field_name = "email"
      field_value = $input.email
      description = "check if a user exists"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDelFn requires a field_name", () => {
    const parser = parse(`del user {
      field_value = $input.email
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbDelFn requires a field_value", () => {
    const parser = parse(`del user {
      field_name = "email"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
