import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbExternalDirectQueryFn();
  return parser;
}

describe("dbExternalDirectQueryFn", () => {
  it("dbExternalDirectQueryFn accepts a code, response_type and connection_string", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      connection_string = ""
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbExternalDirectQueryFn can be disabled", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      connection_string = ""
      disabled = true
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbExternalDirectQueryFn accepts a description", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      connection_string = ""
      description = "external query"
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbExternalDirectQueryFn accepts multiple args", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      connection_string = ""
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbExternalDirectQueryFn accepts multiline", () => {
    const parser = parse(`direct_query {
      sql = """
        SELECT * 
        FROM USERS
        WHERE name = $input.name
        """
      response_type = "list"
      connection_string = ""
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("dbExternalDirectQueryFn requires code", () => {
    const parser = parse(`direct_query {
      response_type = "list"
      connection_string = ""
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbExternalDirectQueryFn requires connection_string", () => {
    const parser = parse(`direct_query {
      sql = "SELECT * FROM USERS"
      response_type = "list"
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbExternalDirectQueryFn requires response_type", () => {
    const parser = parse(`direct_query {
      sql = """
        SELECT * 
        FROM USERS
        WHERE name = $input.name
        """
      connection_string = ""
      arg = $input.name
      arg = $input.category
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });
});
