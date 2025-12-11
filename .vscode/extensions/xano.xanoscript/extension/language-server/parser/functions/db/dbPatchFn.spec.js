import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbPatchFn();
  return parser;
}

describe("dbPatchFn", () => {
  it("dbPatchFn accepts data, field_name and field_value", () => {
    const parser = parse(`patch user {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbPatchFn accepts a multiline data object", () => {
    const parser = parse(`patch user {
      field_name = "email"
      field_value = $input.email
      data = { 
        name: $input.name
        age: $input.age
      }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbPatchFn accepts a string literal for table", () => {
    const parser = parse(`patch "my users" {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbPatchFn can be disabled", () => {
    const parser = parse(`patch user {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
      disabled = true
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbPatchFn accepts a description", () => {
    const parser = parse(`patch user {
      field_name = "email"
      field_value = $input.email
      description = "check if a user exists"
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbPatchFn requires a field_name", () => {
    const parser = parse(`patch user {
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbPatchFn requires a field_value", () => {
    const parser = parse(`patch user {
      field_name = "email"
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbPatchFn requires a data field", () => {
    const parser = parse(`patch user {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
