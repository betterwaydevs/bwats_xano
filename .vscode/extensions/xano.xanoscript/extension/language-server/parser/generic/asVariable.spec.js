import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.asVariable();
  return parser;
}

describe("asVariable", () => {
  it("asVariable should be using a $var", () => {
    const parser = parse("as $foo");
    expect(parser.errors).to.be.empty;
  });

  it("asVariable should store the variable name", () => {
    const parser = parse("as $foo");
    expect(parser.__symbolTable.var["$foo"]).to.not.be.undefined;
  });

  it("asVariable should store the variable name", () => {
    const parser = parse("as $var.bar");
    expect(parser.__symbolTable.var["$bar"]).to.not.be.undefined;
  });

  it("asVariable rejects invalid variable names", () => {
    const parser = parse("as foo");
    expect(parser.errors).to.not.be.empty;
  });

  it("asVariable reject double $ sign in variable", () => {
    const parser = parse("as $$clients");
    expect(parser.errors).to.not.be.empty;
  });
});
