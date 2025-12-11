import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.chainedIdentifier();
  return parser;
}

describe("chainedIdentifier", () => {
  it("chainedIdentifier empty", () => {
    const parser = parse("");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a dot value", () => {
    const parser = parse(".x");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier an array index", () => {
    const parser = parse("[12]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a hash index", () => {
    const parser = parse(`["key"]`);
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier an expression context index", () => {
    const parser = parse("[$$]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a variable as array index", () => {
    const parser = parse("[$var.index]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a string literal as a hash property index", () => {
    let parser = parse(`[$var.["property"]]`);
    expect(parser.errors).to.be.empty;

    parser = parse(`[$var["property"]]`);
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a input as array index", () => {
    const parser = parse("[$input.index]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a shorthand variable as an array index", () => {
    const parser = parse("[$index]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier could reference properties starting with $", () => {
    let parser = parse(".$index");
    expect(parser.errors).to.be.empty;

    parser = parse(".foo.$bar");
    expect(parser.errors).to.be.empty;

    parser = parse(".2.$bar");
    expect(parser.errors).to.be.empty;

    parser = parse("[$index].$bar");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a dot value and array index", () => {
    const parser = parse(".x[1]");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a dot value and array index", () => {
    const parser = parse(".x.2.y");
    expect(parser.errors).to.be.empty;
  });

  it("chainedIdentifier a dot value and array index and value", () => {
    const parser = parse(".x[1].y.z[2]");
    expect(parser.errors).to.be.empty;
  });
});
