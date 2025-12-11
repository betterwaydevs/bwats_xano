import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbEditFn();
  return parser;
}

describe("dbEditFn", () => {
  it("dbEditFn accepts data, field_name and field_value", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn accepts a multiline data object", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = { 
        name: $input.name
        age: $input.age
      }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn accepts an output", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = { 
        name: $input.name
        age: $input.age
      }
      output = ["id", "name", "email"]
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn rejects a variable as data", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = $input.data
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbEditFn rejects data with a badly formed object", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = { 
        name: $input.name,
        someError
      }
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbEditFn accepts a string literal for table", () => {
    const parser = parse(`edit "my users" {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn can be disabled", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      data = { name: $input.name }
      disabled = true
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn accepts a description", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
      description = "check if a user exists"
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbEditFn requires a field_name", () => {
    const parser = parse(`edit user {
      field_value = $input.email
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbEditFn requires a field_value", () => {
    const parser = parse(`edit user {
      field_name = "email"
      data = { name: $input.name }
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbEditFn requires a data field", () => {
    const parser = parse(`edit user {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
