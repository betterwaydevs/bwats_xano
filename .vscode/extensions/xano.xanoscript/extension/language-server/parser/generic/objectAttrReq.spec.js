import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../lexer/control.js";
import { lexDocument } from "../../lexer/lexer.js";
import { Identifier } from "../../lexer/tokens.js";
import { parser } from "../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.objectAttrReq_test_required = this.RULE(
    "objectAttrReq_test_required",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, { ARGS: [name, ["foo"]] });
    }
  );

  // this rule has no required fields and two optional fields
  this.objectAttrReq_test_optionals = this.RULE(
    "objectAttrReq_test_optionals",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, { ARGS: [name, [], ["foo", "bar"]] });
    }
  );

  // this rule has one required and one optional field
  this.objectAttrReq_test_optional_and_required = this.RULE(
    "objectAttrReq_test_optional_and_required",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [name, ["required"], ["option"]],
      });
    }
  );

  // this rule has one required and one optional field
  this.objectAttrReq_test_type_req = this.RULE(
    "objectAttrReq_test_type_req",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [
          name,
          [],
          ["bool", "string", "integer", "decimal", "number", "func"],
          {
            types: {
              bool: "boolean",
              string: "string",
              integer: "integer",
              decimal: "decimal",
              number: "number",
              func: ($, identifier) => {
                $.SUBRULE(this.objectAttrReq, {
                  ARGS: [
                    identifier,
                    ["test"],
                    [],
                    {
                      types: {
                        test: "string",
                      },
                    },
                  ],
                });
              },
            },
          },
        ],
      });
    }
  );

  // this rule tests array types as enums
  this.objectAttrReq_test_enum_req = this.RULE(
    "objectAttrReq_test_enum_req",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [
          name,
          [],
          ["status"],
          {
            types: {
              status: ["active", "pending", "inactive"], // array treated as enum
            },
          },
        ],
      });
    }
  );

  // this rule allows duplicates for the "arg" field
  this.objectAttrReq_test_allow_duplicates = this.RULE(
    "objectAttrReq_test_allow_duplicates",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [name, [], ["arg"], { allowDuplicates: ["arg"] }],
      });
    }
  );

  this.objectAttrReq_test_allow_array_object = this.RULE(
    "objectAttrReq_test_allow_array_object",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [name, [], ["arr", "obj"]],
      });
    }
  );

  this.objectAttrReq_test_obj_in_arr_in_obj = this.RULE(
    "objectAttrReq_test_obj_in_arr_in_obj",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [name, [], ["type", "field"]],
      });
    }
  );

  this.objectAttrReq_test_allow_multiple_format = this.RULE(
    "objectAttrReq_test_allow_multiple_format",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.objectAttrReq, {
        ARGS: [name, [], ["singleline", "multiline"]],
      });
    }
  );
}

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  return parser;
}

describe("objectAttrReq", () => {
  it("objectAttrReq matched requirements", () => {
    parse(`something = { 
      foo: "bar" 
    }`).objectAttrReq_test_required();

    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq discover missing requirements", () => {
    parse(`something = { 
      foot: "bar" 
    }`).objectAttrReq_test_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("objectAttrReq discover optional requirements", () => {
    // should allow one optional requirement
    parse(`something = { 
      foo: "bar" 
    }`).objectAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow one optional requirement
    parse(`something = { 
      bar: "foo" 
    }`).objectAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow all optional requirements
    parse(`something = { 
      bar: "foo" 
      foo: "bar" 
    }`).objectAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow no optional requirements defined
    parse(`something = {}`).objectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows object fields", () => {
    parse(`something = { 
      obj: { foo: "bar" }
    }`).objectAttrReq_test_allow_array_object();

    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows single line object ", () => {
    parse(`something = { obj: "bar" }`).objectAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq key can be a string", () => {
    parse(`something = { 
      "obj": "bar" 
    }`).objectAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq accepts optional commas", () => {
    parse(
      `something = { obj: "bar", "arr": "bar" }`
    ).objectAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows array fields", () => {
    parse(`something = { 
      arr: [1,2, 3]
    }`).objectAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows obj in array in obj", () => {
    parse(
      `x = {type: "primary", field: [{name: "id"}]}`
    ).objectAttrReq_test_obj_in_arr_in_obj();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows array fields", () => {
    parse(`something = { 
      arr: [1,2, 3]
      obj: { foo: "bar", bar: "foo" }
    }`).objectAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows a mix of single and multiline values", () => {
    parse(`something = { 
      multiline: {
        foo: "bar"
        bar: "foo"
      }
      singleline: { foo: "bar", bar: "foo" }
    }`).objectAttrReq_test_allow_multiple_format();
    expect(parser.errors).to.be.empty;
  });

  it("objectAttrReq allows specific duplicates", () => {
    // foo is defined twice
    parse(`something = { 
      arg: "fizz" 
      arg: "buzz" 
    }`).objectAttrReq_test_allow_duplicates();

    expect(parser.errors).to.be.empty;

    // foo is defined twice
    parse(`something = { 
      arg: "fizz" 
      arg: "buzz" 
      foo: "bar"
      foo: "baz"
    }`).objectAttrReq_test_allow_duplicates();

    expect(parser.errors).to.not.be.empty;
  });

  it("objectAttrReq detects duplicates", () => {
    // foo is defined twice
    parse(`something = { 
      foo: "fizz" 
      foo: "buzz" 
    }`).objectAttrReq_test_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("objectAttrReq detects string literal duplicates", () => {
    // foo is defined twice
    parse(`something = { 
      "foo": "fizz" 
      foo: "buzz" 
    }`).objectAttrReq_test_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("objectAttrReq enforces optional requirements", () => {
    // foot is not an optional requirement
    parse(`something = { 
      foot = "bar" 
    }`).objectAttrReq_test_optionals();

    expect(parser.errors).to.not.be.empty;
  });

  it("objectAttrReq enforces optional and required fields", () => {
    // all optional and required fields are present
    parse(`something = {
      option: "bar"
      required: "bar"
    }`).objectAttrReq_test_optional_and_required();
    expect(parser.errors).to.be.empty;

    // optional field is missing (all good)
    parse(`something = {
      required: "bar"
    }`).objectAttrReq_test_optional_and_required();

    expect(parser.errors).to.be.empty;

    // required field is missing (not good)
    parse(`something = { 
      option: "bar" 
    }`).objectAttrReq_test_optional_and_required();

    expect(parser.errors).to.not.be.empty;
  });

  describe("objectAttrReq types", () => {
    it("enforces string types when provided", () => {
      parse(`typed = { 
        string: "4"
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.be.empty;

      parse(`typed = { 
        string: 4
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.not.be.empty;
    });

    it("enforces boolean types when provided", () => {
      parse(`typed = { 
        bool: true
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.be.empty;

      parse(`typed = { 
        bool: 4
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.not.be.empty;
    });

    it("enforces number types when provided", () => {
      parse(`typed = { 
        number: 4
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.be.empty;

      parse(`typed = { 
        number: 0.5
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.be.empty;

      parse(`typed = { 
        number: "4"
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.not.be.empty;
    });

    it("enforces function types when provided", () => {
      parse(`typed = {
        func: { test: "1" }
      }`).objectAttrReq_test_type_req();

      expect(parser.errors).to.be.empty;
    });

    it("enforces array types as enums when provided", () => {
      // Valid enum value
      parse(`typed = {
        status: "active"
      }`).objectAttrReq_test_enum_req();

      expect(parser.errors).to.be.empty;

      // Another valid enum value
      parse(`typed = {
        status: "pending"
      }`).objectAttrReq_test_enum_req();

      expect(parser.errors).to.be.empty;

      // Invalid enum value
      parse(`typed = {
        status: "invalid"
      }`).objectAttrReq_test_enum_req();

      expect(parser.errors).to.not.be.empty;
      expect(parser.errors[0].message).to.include("Must be one of");
    });
  });
});
