import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../../lexer/control.js";
import { lexDocument } from "../../../lexer/lexer.js";
import { Identifier } from "../../../lexer/tokens.js";
import { parser } from "../../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.schemaParseObjectFn_flat = this.RULE("schemaParseObjectFn_flat", () => {
    const schema = { "[string]": "[number]" };
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    const obj = {};
    this.SUBRULE(this.schemaParseObjectFn, {
      ARGS: [name, schema, obj],
    });
  });

  this.schemaParseObjectFn_deep = this.RULE("schemaParseObjectFn_deep", () => {
    const schema = {
      "[string]": {
        test: ["[number]"],
        bool: "[boolean]",
        hey: "some constant",
      },
    };
    const name = this.CONSUME(Identifier);
    this.CONSUME(EqualToken); // "="
    this.SUBRULE(this.schemaParseObjectFn, { ARGS: [name, schema] });
  });

  this.schemaParseObjectFn_disabled = this.RULE(
    "schemaParseObjectFn_disabled",
    () => {
      const schema = {
        "![string]": {
          valid: "[boolean]",
          "!invalid": "[boolean]",
        },
      };
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseObjectFn, { ARGS: [name, schema] });
    }
  );

  this.schemaParseObjectFn_optional = this.RULE(
    "schemaParseObjectFn_optional",
    () => {
      const schema = {
        "[string]": {
          "optional?": "[number]",
          required: "[boolean]",
        },
      };
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseObjectFn, { ARGS: [name, schema] });
    }
  );

  this.schemaParseObjectFn_multiple = this.RULE(
    "schemaParseObjectFn_multiple",
    () => {
      const schema = {
        "[string]": {
          "multi*": "[number]",
          required: "[boolean]",
        },
      };
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.schemaParseObjectFn, { ARGS: [name, schema] });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("schemaParseObjectFn", () => {
  it("schemaParseObjectFn accepts mix types and constants", () => {
    parse(`value = {something: 345}`).schemaParseObjectFn_flat();
    expect(parser.errors).to.be.empty;

    parse(`value = {
      something: 123.2,
      other_thing: 44
    }`).schemaParseObjectFn_flat();
    expect(parser.errors).to.be.empty;

    parse(
      `value = { something: 123.2, other_thing: 44 }`
    ).schemaParseObjectFn_flat();
    expect(parser.errors).to.be.empty;

    parse(`value = {
      something: 123.2,
      other_thing: 44,
    }`).schemaParseObjectFn_flat();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn rejects duplicate keys", () => {
    parse(
      `value = {something: 345, something: 123}`
    ).schemaParseObjectFn_flat();
    expect(parser.errors).to.not.be.empty;

    parse(
      `value = {
        my.property.key: 345, 
        my.property.key: 123
      }`
    ).schemaParseObjectFn_flat();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseObjectFn accepts different sub-property on duplicate roots", () => {
    parse(`value = {
      my.property.foo: 345, 
      my.property.key: 123
    }`).schemaParseObjectFn_flat();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn immutable restricts to valid token", () => {
    parse(`value = {123: 124}`).schemaParseObjectFn_flat();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseObjectFn accepts deep definition", () => {
    parse(`value = {
      something: {
        test: [123, 456]
        bool: true
        hey: "some constant"
      } 
    }`).schemaParseObjectFn_deep();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn rejects errors in deep definition", () => {
    parse(`value = {
      something: {
        test: 123,
        bool: true,
        hey: "some constant"
      } 
    }`).schemaParseObjectFn_deep();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseObjectFn rejects missing keys", () => {
    parse(`value = {
      something: {
        test: [123, 456]
        hey: "some constant"
      } 
    }`).schemaParseObjectFn_deep();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseObjectFn accepts membership format for keys", () => {
    parse(`value = {
      some.thing.here: {
        test: [123, 456]
        bool: true
        hey: "some constant"
      } 
    }`).schemaParseObjectFn_deep();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn accepts optional keys", () => {
    parse(`value = {
      something: {
        optional: 123
        required: true
      } 
    }`).schemaParseObjectFn_optional();
    expect(parser.errors).to.be.empty;

    parse(`value = {
      something: {
        required: true
      } 
    }`).schemaParseObjectFn_optional();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn accept disabled keys", () => {
    parse(`value = {
      !disabled: { valid: true, invalid: false }
      no_disabled: { valid: false, !invalid: true }
    }`).schemaParseObjectFn_disabled();
    expect(parser.errors).to.be.empty;
  });

  it("schemaParseObjectFn accept disabled keys", () => {
    parse(`value = {
      !disabled: { valid: true, invalid: false }
      no_disabled: { !valid: false, !invalid: true }
    }`).schemaParseObjectFn_disabled();
    expect(parser.errors).to.not.be.empty;
  });

  it("schemaParseObjectFn accepts multiple keys", () => {
    parse(`value = {
      something: { multi: 123, multi: 456, required: true }
    }`).schemaParseObjectFn_multiple();
    expect(parser.errors).to.be.empty;
    parse(`value = {
      something: { required: true }
    }`).schemaParseObjectFn_multiple();
    expect(parser.errors).to.be.empty;
  });
});
