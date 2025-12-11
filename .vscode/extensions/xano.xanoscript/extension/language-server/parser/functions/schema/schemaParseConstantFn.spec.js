import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.schemaParseConstantFn_test_constant_string = this.RULE(
    "schemaParseConstantFn_test_constant_string",
    () => {
      const schema = "value";
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseConstantFn, { ARGS: [name, schema] });
    }
  );

  // this rule requires a foo field to be defined
  this.schemaParseConstantFn_test_constant_boolean = this.RULE(
    "schemaParseConstantFn_test_constant_boolean",
    () => {
      const schema = true;
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseConstantFn, { ARGS: [name, schema] });
    }
  );

  // this rule requires a foo field to be defined
  this.schemaParseConstantFn_test_constant_number = this.RULE(
    "schemaParseConstantFn_test_constant_number",
    () => {
      const schema = 42;
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseConstantFn, { ARGS: [name, schema] });
    }
  );

  // check the null case too
  // this rule requires a foo field to be defined
  this.schemaParseConstantFn_test_constant_null = this.RULE(
    "schemaParseConstantFn_test_constant_null",
    () => {
      const schema = null;
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseConstantFn, { ARGS: [name, schema] });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaParseConstantFn", () => {
  it("schemaParseConstantFn constant string", () => {
    parse(`something = "value"`).schemaParseConstantFn_test_constant_string();
    expect(parser.errors).to.be.empty;

    parse("something = `value`").schemaParseConstantFn_test_constant_string();
    expect(parser.errors).to.not.be.empty;

    parse(`something = """
      value
      """`).schemaParseConstantFn_test_constant_string();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseConstantFn rejects non valid string contstant", () => {
    parse(`something = 123`).schemaParseConstantFn_test_constant_string();
    expect(parser.errors).to.not.be.empty;

    parse(`something = false`).schemaParseConstantFn_test_constant_string();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseConstantFn constant boolean", () => {
    parse(`something = true`).schemaParseConstantFn_test_constant_boolean();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseConstantFn reject non valid boolean constant", () => {
    parse(`something = 1`).schemaParseConstantFn_test_constant_boolean();
    expect(parser.errors).to.not.be.empty;

    parse(`something = false`).schemaParseConstantFn_test_constant_boolean();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseConstantFn constant number", () => {
    parse(`something = 42`).schemaParseConstantFn_test_constant_number();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseConstantFn reject non valid number constant", () => {
    parse(`something = 44`).schemaParseConstantFn_test_constant_number();
    expect(parser.errors).to.not.be.empty;

    parse(`something = 42.0`).schemaParseConstantFn_test_constant_number();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseConstantFn constant null", () => {
    parse(`something = null`).schemaParseConstantFn_test_constant_null();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseConstantFn reject non valid null constant", () => {
    parse(`something = 0`).schemaParseConstantFn_test_constant_null();
    expect(parser.errors).to.not.be.empty;

    parse(`something = false`).schemaParseConstantFn_test_constant_null();
    expect(parser.errors).to.not.be.empty;
  });
});
