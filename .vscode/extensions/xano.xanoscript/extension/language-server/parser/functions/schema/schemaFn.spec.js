import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.schemaFn_test_immutable = this.RULE("schemaFn_test_immutable", () => {
    const schema = "[string]";
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
  });

  // this rule requires a foo field to be defined
  this.schemaFn_test_expression = this.RULE("schemaFn_test_expression", () => {
    const schema = "[expression]";
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
  });

  // this rule requires a foo field to be defined
  this.schemaFn_test_mock = this.RULE("schemaFn_test_mock", () => {
    const schema = "[mock]";
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
  });

  // this rule requires a foo field to be defined
  this.schemaFn_test_enum = this.RULE("schemaFn_test_enum", () => {
    const schema = ["yes", 123];
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
  });
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaFn", () => {
  it("schemaFn immutable restrictions", () => {
    parse(`something = "foo"`).schemaFn_test_immutable();
    expect(parser.errors).to.be.empty;

    parse(`something = 'bar'`).schemaFn_test_immutable();
    expect(parser.errors).to.be.empty;

    parse(`something = bar`).schemaFn_test_immutable();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaFn rejects a bad immutable", () => {
    parse(`something = true`).schemaFn_test_immutable();
    expect(parser.errors).to.not.be.empty;

    parse(`something = 123`).schemaFn_test_immutable();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaFn rejects a bad value", () => {
    parse(`something = true|something`).schemaFn_test_expression();
    expect(parser.errors).to.not.be.empty;

    parse(`something = 12 3`).schemaFn_test_expression();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaFn accepts a value", () => {
    parse(`something = true|not`).schemaFn_test_expression();
    expect(parser.errors).to.be.empty;

    parse(`something = [123 + 123]`).schemaFn_test_expression();
    expect(parser.errors).to.be.empty;
  });

  it("schemaFn accepts an enum", () => {
    parse(`something = "yes"`).schemaFn_test_enum();
    expect(parser.errors).to.be.empty;

    parse(`something = 123`).schemaFn_test_enum();
    expect(parser.errors).to.be.empty;
  });
});
