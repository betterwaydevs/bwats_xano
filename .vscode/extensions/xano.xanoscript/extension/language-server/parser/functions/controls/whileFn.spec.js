import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.whileFn();
  return parser;
}

describe("whileFn", () => {
  it("whileFn can be an empty statement", () => {
    const parser = parse(`while (true == true) {
      each
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn can be a multiline statement", () => {
    const parser = parse(`while (
      true == true
    ) {
      each
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn accept a stack statement (in each)", () => {
    const parser = parse(`while (true == true) {
      each { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn accept a default statement", () => {
    const parser = parse(`while (true == true) {
      each {
        var $x2 {
          value = 12212
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn accept break statement", () => {
    const parser = parse(`while (true == true) {
      each { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn accepts a description", () => {
    const parser = parse(`while (true == true) {
      description = "foo"
      each { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn can be disabled", () => {
    const parser = parse(`while (true == true) {
      disabled = true
      each { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("whileFn does requires an each statement", () => {
    const parser = parse(`while (true == true) {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
