import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbGetFn();
  return parser;
}

describe("dbGetFn", () => {
  it("dbGetFn accepts a field_name and field_value", () => {
    const parser = parse(`get user {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn accepts a string literal for table", () => {
    const parser = parse(`get "my users" {
      field_name = "email"
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn can be disabled", () => {
    const parser = parse(`get user {
      field_name = "email"
      field_value = $input.email
      disabled = true
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn accepts a lock field", () => {
    const parser = parse(`get user {
      field_name = "id"
      field_value = ""
      lock = true
    } as $user1`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn accepts output fields", () => {
    const parser = parse(`get user {
      field_name = "email"
      field_value = $input.email
      output = ["id", "email", "created_at"]
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn accepts a description", () => {
    const parser = parse(`get user {
      field_name = "email"
      field_value = $input.email
      description = "query to get user by email"
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn requires a field_name", () => {
    const parser = parse(`get user {
      field_value = $input.email
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbGetFn accepts an addon", () => {
    const parser = parse(`get user {
      field_value = $input.email
      field_name = "email"
      addon = [
        {name: "client", input: {client_id: ""}, as: "_client"}
      ]
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn accepts sub addon", () => {
    const parser = parse(`get user {
      field_value = $input.email
      field_name = "email"
      addon = [
       {
          as: "client1"
          name: "client",
          input: {client_id: ""}
          addon: [
            {
              name: "client"
              input: {client_id: $output.id}
              as: "client2"
            }
            {
              name: "bar"
              as: "foo"
            }
          ]
        }
      ]
    } as $user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbGetFn requires a field_value", () => {
    const parser = parse(`get user {
      field_name = "email"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
