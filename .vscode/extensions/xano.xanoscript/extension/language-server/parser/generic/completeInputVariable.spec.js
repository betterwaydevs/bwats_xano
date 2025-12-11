import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.completeInputVariable();
  return parser;
}

describe("completeInputVariable", () => {
  it("completeInputVariable empty", () => {
    const parser = parse("$input.foo");
    expect(parser.errors).to.be.empty;
  });

  it("completeInputVariable a dot value", () => {
    const parser = parse("$input.x.bar");
    expect(parser.errors).to.be.empty;
  });

  it("completeInputVariable an array index", () => {
    const parser = parse("$input.x[12]");
    expect(parser.errors).to.be.empty;
  });

  it("completeInputVariable a string as a hash property index", () => {
    let parser = parse(`$input["value"]`);
    expect(parser.errors).to.be.empty;

    parser = parse(`$input.["value"]`);
    expect(parser.errors).to.be.empty;

    parser = parse(`$input.["value"]["bar"].[1]["pie"]`);
    expect(parser.errors).to.be.empty;
  });

  it("completeInputVariable an expression context index", () => {
    const parser = parse("$input.x[$$]");
    expect(parser.errors).to.be.empty;
  });

  it("completeInputVariable cannot be referenced without an attribute", () => {
    const parser = parse("$input");
    expect(parser.errors).to.not.be.empty;
  });

  it("completeInputVariable cannot reference an index", () => {
    const parser = parse("$input[0]");
    expect(parser.errors).to.not.be.empty;
  });
});
