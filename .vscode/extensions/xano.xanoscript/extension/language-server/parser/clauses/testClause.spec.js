import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.testClause();
  return parser;
}

describe("testClause", () => {
  it("testClause defines a named test", () => {
    const parser = parse(`test "should add numbers" {
      expect.to_equal ($response) {
        value = 5
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("testClause accepts a comment", () => {
    const parser = parse(`test "should add numbers" {
      expect.to_equal ($response) {
        value = 5
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("testClause requires accepts an optional datasource", () => {
    const parser = parse(`test "should add numbers" {
      datasource = "live"

      expect.to_equal ($response) {
        value = 5
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("testClause can have many expects", () => {
    const parser = parse(`test "should add numbers" {
      expect.to_equal ($response) {
        value = 5
      }

      expect.to_be_defined ($response)
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("testClause accepts inputs", () => {
    const parser = parse(`test "should add numbers" {
      input = {
        a: 2
        b: 3
      }

      expect.to_equal ($response) {
        value = 5
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("testClause accepts a one liner input", () => {
    const parser = parse(`test "should add numbers" {
      input = { a: 2, b: 3 }

      expect.to_be_greater_than ($response) {
        value = 4
      }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
