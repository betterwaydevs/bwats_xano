import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbAddFn();
  return parser;
}

describe("dbAddFn", () => {
  it("dbAddFn accepts data field", () => {
    const parser = parse(`add user {
      data = { name: $input.name }
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn accepts a multiline data object", () => {
    const parser = parse(`add user {
      data = { 
        name: $input.name
        age: $input.age
      }
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn accepts a string literal for table", () => {
    const parser = parse(`add "my users" {
      data = { name: $input.name }
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn can be disabled", () => {
    const parser = parse(`add user {
      data = { name: $input.name }
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn accepts a description", () => {
    const parser = parse(`add user {
      description = "add a new user"
      data = { name: $input.name }
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn accepts an addon", () => {
    const parser = parse(`add user {
      data = { name: $input.name }
      addon = [
        {name: "new add", as: "new_add"}
        {name: "client", input: { client_id: $output.id }, as: "_client"}
      ]
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("dbAddFn requires a data field", () => {
    const parser = parse(`add user {
      description = "add a new user"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
