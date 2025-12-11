import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.forEachFn();
  return parser;
}

describe("forEachFn", () => {
  it("forEachFn can be an empty statement", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      each as $item
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn can also be foreach.remove", () => {
    const parser = parse(`foreach.remove`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn accept a stack statement (in each as $item)", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      each as $item { 
        var $x {
          value = 12|add:$item
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn accept an as any variable", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      each as $foo { 
        var $x {
          value = 12|add:$foo
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn accept a default statement", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      each as $item {
        var $x2 {
          value = 12212|add:$item
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn accept break statement", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      each as $item { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn accepts a description", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      description = "foo"
      each as $item { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn can be disabled", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      disabled = true
      each as $item { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("forEachFn does requires an each as $item statement", () => {
    const parser = parse(`foreach ([]|push:1|push:2|push:3|push:4) {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
