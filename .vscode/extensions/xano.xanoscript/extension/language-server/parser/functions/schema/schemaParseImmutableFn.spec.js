import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  this.schemaParseImmutableFn_test_immutable_string = this.RULE(
    "schemaFn_test_immutable_string",
    () => {
      const schema = "[string]";
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
    }
  );

  this.schemaParseImmutableFn_test_immutable_boolean = this.RULE(
    "schemaFn_test_immutable_boolean",
    () => {
      const schema = "[boolean]";
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
    }
  );

  this.schemaParseImmutableFn_test_immutable_number = this.RULE(
    "schemaFn_test_immutable_number",
    () => {
      const schema = "[number]";
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaFn, { ARGS: [name, schema] });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaParseImmutableFn", () => {
  it("schemaParseImmutableFn immutable string", () => {
    parse(`something = "foo"`).schemaParseImmutableFn_test_immutable_string();
    expect(parser.errors).to.be.empty;

    parse(`something = 'foo'`).schemaParseImmutableFn_test_immutable_string();
    expect(parser.errors).to.be.empty;

    // bar is not a string
    parse(`something = bar`).schemaParseImmutableFn_test_immutable_string();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseImmutableFn immutable restricts string", () => {
    parse(`something = 123`).schemaParseImmutableFn_test_immutable_string();
    expect(parser.errors).to.not.be.empty;

    parse(`something = false`).schemaParseImmutableFn_test_immutable_string();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseImmutableFn immutable boolean", () => {
    parse(`something = true`).schemaParseImmutableFn_test_immutable_boolean();
    expect(parser.errors).to.be.empty;

    parse(`something = false`).schemaParseImmutableFn_test_immutable_boolean();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseImmutableFn immutable restricts boolean", () => {
    parse(`something = 123`).schemaParseImmutableFn_test_immutable_boolean();
    expect(parser.errors).to.not.be.empty;

    parse(`something = "foo"`).schemaParseImmutableFn_test_immutable_boolean();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseImmutableFn immutable number", () => {
    parse(`something = 123`).schemaParseImmutableFn_test_immutable_number();
    expect(parser.errors).to.be.empty;

    parse(`something = 45.67`).schemaParseImmutableFn_test_immutable_number();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseImmutableFn immutable restricts number", () => {
    parse(`something = true`).schemaParseImmutableFn_test_immutable_number();
    expect(parser.errors).to.not.be.empty;

    parse(`something = "foo"`).schemaParseImmutableFn_test_immutable_number();
    expect(parser.errors).to.not.be.empty;
  });
});
