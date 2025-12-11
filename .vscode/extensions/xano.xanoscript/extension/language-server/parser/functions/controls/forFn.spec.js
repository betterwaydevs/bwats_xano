import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.forFn();
  return parser;
}

describe("forFn", () => {
  it("forFn can be an empty statement", () => {
    const parser = parse(`for (10) {
      each as $index
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn accept a stach statement (in each as $index)", () => {
    const parser = parse(`for (10) {
      each as $index { 
        var $x {
          value = 12|add:$index
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn accept a default statement", () => {
    const parser = parse(`for (10) {
      each as $index {
        var $x2 {
          value = 12212|add:$index
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn accept break statement", () => {
    const parser = parse(`for (10) {
      each as $index { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn accepts a description", () => {
    const parser = parse(`for (10) {
      description = "foo"
      each as $index { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn can be disabled", () => {
    const parser = parse(`for (10) {
      disabled = true
      each as $index { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forFn does requires an each as $index statement", () => {
    const parser = parse(`for (10) {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
