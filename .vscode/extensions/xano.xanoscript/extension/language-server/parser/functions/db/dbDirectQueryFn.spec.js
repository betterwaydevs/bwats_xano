import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbDirectQueryFn();
  return parser;
}

describe("dbDirectQueryFn", () => {
  it("dbDirectQueryFn accepts a code, response_type", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn accepts a parser argument", () => {
    let parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      parser = "template_engine"
      response_type = "single"
      arg = $input.user_id
    } as $x3`);
    expect(parser.errors).to.be.empty;

    parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      parser = "prepared"
      response_type = "list"
      arg = $input.user_id
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn can be disabled", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      disabled = true
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn accepts a description", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      description = "external query"
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn accepts multiple args", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn accepts multiline", () => {
    const parser = parse(`direct_query {
      sql = """
        SELECT * 
        FROM USERS
        WHERE name = $input.name
        """
      response_type = "list"
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbDirectQueryFn requires code", () => {
    const parser = parse(`direct_query {
      response_type = "list"
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbDirectQueryFn does not require a response_type", () => {
    const parser = parse(`direct_query {
      sql = """
        SELECT * 
        FROM USERS
        WHERE name = $input.name
        """
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });
});
