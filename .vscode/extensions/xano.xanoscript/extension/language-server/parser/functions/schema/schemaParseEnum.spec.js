import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.schemaParseEnumFn_immutable_and_const = this.RULE(
    "schemaParseEnumFn_immutable_and_const",
    () => {
      const schema = ["[string]", "[number]"];
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseEnumFn, { ARGS: [name, schema] });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaParseEnumFn", () => {
  it("schemaParseEnumFn accepts mix types and constants", () => {
    parse(`something = 'test'`).schemaParseEnumFn_immutable_and_const();
    expect(parser.errors).to.be.empty;

    parse(`something = 123`).schemaParseEnumFn_immutable_and_const();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseEnumFn immutable restricts to valid token", () => {
    parse(`something = false`).schemaParseEnumFn_immutable_and_const();
    expect(parser.errors).to.not.be.empty;

    parse(`something = [123]`).schemaParseEnumFn_immutable_and_const();
    expect(parser.errors).to.not.be.empty;

    parse(`something = {foo: "Bar"}`).schemaParseEnumFn_immutable_and_const();
    expect(parser.errors).to.not.be.empty;
  });
});
