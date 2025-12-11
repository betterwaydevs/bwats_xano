import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbSchemaFn();
  return parser;
}

describe("dbSchemaFn", () => {
  it("dbSchemaFn accepts a path", () => {
    const parser = parse(`schema user {
      path = "email"
    } as $email_schema`);
    expect(parser.errors).to.be.empty;
  });

  it("dbSchemaFn can be disabled", () => {
    const parser = parse(`schema user {
      path = "email"
      disabled = true
    } as $email_schema`);
    expect(parser.errors).to.be.empty;
  });

  it("dbSchemaFn accepts a description", () => {
    const parser = parse(`schema user {
      path = "email"
      description = "get the user's email schema"
    } as $email_schema`);
    expect(parser.errors).to.be.empty;
  });

  it("dbSchemaFn does not require a path", () => {
    const parser = parse(`schema user as $email_schema`);
    expect(parser.errors).to.be.empty;
  });
});
