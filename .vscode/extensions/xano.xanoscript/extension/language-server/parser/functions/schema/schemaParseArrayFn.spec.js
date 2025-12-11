import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.schemaParseArrayFn_string_arr = this.RULE(
    "schemaParseArrayFn_string_arr",
    () => {
      const schema = ["[string]"];
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseArrayFn, { ARGS: [name, schema] });
    }
  );

  // this rule requires a foo field to be defined
  this.schemaParseArrayFn_string_arr_of_arr = this.RULE(
    "schemaParseArrayFn_string_arr_of_arr",
    () => {
      const schema = [["[string]"]];
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseArrayFn, { ARGS: [name, schema] });
    }
  );

  // this rule requires a foo field to be defined
  this.schemaParseArrayFn_number_arr = this.RULE(
    "schemaParseArrayFn_number_arr",
    () => {
      const schema = ["[number]"];
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseArrayFn, { ARGS: [name, schema] });
    }
  );

  // this rule requires a foo field to be defined
  this.schemaParseArrayFn_expression_arr = this.RULE(
    "schemaParseArrayFn_expression_arr",
    () => {
      const schema = ["[expression]"];
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseArrayFn, { ARGS: [name, schema] });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaParseArrayFn", () => {
  it("schemaParseArrayFn accepts an array of strings", () => {
    parse(`something = ["test", 'bar']`).schemaParseArrayFn_string_arr();
    expect(parser.errors).to.be.empty;

    parse(`something = [
      """
        and
        test
      """
      'bar'
    ]`).schemaParseArrayFn_string_arr();
    expect(parser.errors).to.be.empty;

    parse(`something = []`).schemaParseArrayFn_number_arr();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseArrayFn rejects invalid types ", () => {
    parse(`something = [false]`).schemaParseArrayFn_string_arr();
    expect(parser.errors).to.not.be.empty;

    parse(`something = [123]`).schemaParseArrayFn_string_arr();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseArrayFn rejects invalid format ", () => {
    parse(`something = [123 321]`).schemaParseArrayFn_number_arr();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseArrayFn accept valid number array", () => {
    parse(`something = [
      123, 
      321
    ]`).schemaParseArrayFn_number_arr();
    expect(parser.errors).to.be.empty;

    parse(`something = [1,
      2, 
      3,
    ]`).schemaParseArrayFn_number_arr();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseArrayFn rejects bad types", () => {
    parse(`something = [true]`).schemaParseArrayFn_number_arr();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseArrayFn accepts an array of array of strings", () => {
    parse(
      `something = [["test", 'bar'], ["foo"]]`
    ).schemaParseArrayFn_string_arr_of_arr();
    expect(parser.errors).to.be.empty;

    parse(`something = [
      ['test', "bar"], 
      ["foo"]
    ]`).schemaParseArrayFn_string_arr_of_arr();
    expect(parser.errors).to.be.empty;

    parse(`something = []`).schemaParseArrayFn_string_arr_of_arr();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseArrayFn accepts an array of expressions", () => {
    parse(`something = [1,
      $var.test
      $input.value + 2,
    ]`).schemaParseArrayFn_expression_arr();
    expect(parser.errors).to.be.empty;
  });
});
