import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbTransactionFn();
  return parser;
}

describe("dbTransactionFn", () => {
  it("dbTransactionFn can have an empty body", () => {
    const parser = parse(`transaction {
      stack 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTransactionFn contains a stack", () => {
    const parser = parse(`transaction {
      stack {
        util.sleep {
          value = 1000
          }
        }  
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTransactionFn accepts a description", () => {
    const parser = parse(`transaction {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTransactionFn can be disabled", () => {
    const parser = parse(`transaction {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbTransactionFn requires a stack", () => {
    const parser = parse(`transaction {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
