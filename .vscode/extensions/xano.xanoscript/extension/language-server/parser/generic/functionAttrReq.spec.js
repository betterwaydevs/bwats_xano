import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { Identifier } from "../../lexer/tokens.js";
import { parser } from "../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.functionAttrReq_test_required = this.RULE(
    "functionAttrReq_test_required",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, { ARGS: [name, ["foo"]] });
    }
  );

  // this rule has no required fields and two optional fields
  this.functionAttrReq_test_optionals = this.RULE(
    "functionAttrReq_test_optionals",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, { ARGS: [name, [], ["foo", "bar"]] });
    }
  );

  // this rule has one required and one optional field
  this.functionAttrReq_test_optional_and_required = this.RULE(
    "functionAttrReq_test_optional_and_required",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, ["required"], ["option"]],
      });
    }
  );

  this.functionAttrReq_test_allow_disabled_keys = this.RULE(
    "functionAttrReq_test_allow_disabled_keys",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, ["value", "other"], [], { allowDisabledKeys: true }],
      });
    }
  );

  // this rule allows duplicates for the "arg" field
  this.functionAttrReq_test_allow_duplicates = this.RULE(
    "functionAttrReq_test_allow_duplicates",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, [], ["arg"], { allowDuplicates: ["arg"] }],
      });
    }
  );

  // this rule allows an objectf for the "data" field
  this.functionAttrReq_test_allow_object = this.RULE(
    "functionAttrReq_test_allow_object",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, [], ["data"], { allowObject: ["data"] }],
      });
    }
  );

  // this rule allows an objectf for the "data" field
  this.functionAttrReq_test_enforce_object = this.RULE(
    "functionAttrReq_test_enforce_object",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, [], ["data"], { enforceObject: ["data"] }],
      });
    }
  );

  // this rule allows an objectf for the "data" field
  this.functionAttrReq_test_allow_array = this.RULE(
    "functionAttrReq_test_allow_array",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, [], ["data"], { allowArray: ["data"] }],
      });
    }
  );

  // this rule allows an objectf for the "data" field
  this.functionAttrReq_test_allow_array_object = this.RULE(
    "functionAttrReq_test_allow_array_object",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [
          name,
          [],
          ["obj", "arr"],
          { allowArray: ["arr"], allowObject: ["obj"] },
        ],
      });
    }
  );

  this.functionAttrReq_test_mocks = this.RULE(
    "functionAttrReq_test_mocks",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, [], ["mock", "value"]],
      });
    }
  );

  this.functionAttrReq_test_mocks_with_required_arg = this.RULE(
    "functionAttrReq_test_mocks_with_required_arg",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, ["value", "mock"], []],
      });
    }
  );

  this.functionAttrReq_test_mock_not_allowed = this.RULE(
    "functionAttrReq_test_mock_not_allowed",
    () => {
      const name = this.CONSUME(Identifier);
      this.SUBRULE(this.functionAttrReq, {
        ARGS: [name, ["value"], []],
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

describe("functionAttrReq", () => {
  it("functionAttrReq matched requirements", () => {
    parse(`something { 
      foo = "bar" 
    }`).functionAttrReq_test_required();

    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq accept another variable reference", () => {
    parse(`something { 
      foo = $response.foo.baz 
    }`).functionAttrReq_test_required();
    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq can be on a single line when there is only one attribute", () => {
    parse(`something { foo = "bar" }`).functionAttrReq_test_required();
    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq discover missing requirements", () => {
    parse(`something { 
      foot = "bar" 
    }`).functionAttrReq_test_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq discover optional requirements", () => {
    // should allow one optional requirement
    parse(`something { 
      foo = "bar" 
    }`).functionAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow one optional requirement
    parse(`something { 
      bar = "foo" 
    }`).functionAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow all optional requirements
    parse(`something { 
      bar = "foo" 
      foo = "bar" 
    }`).functionAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;

    // should allow no optional requirements defined
    parse(`something { 
    }`).functionAttrReq_test_optionals();

    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq allows object fields", () => {
    parse(`something { 
      data = { foo: "bar" }
    }`).functionAttrReq_test_allow_object();

    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq allows array fields", () => {
    parse(`something { 
      data = [1,2, 3]
    }`).functionAttrReq_test_allow_array();
    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq allows array fields", () => {
    parse(`something { 
      arr = [1,2, 3]
      obj = { foo: "bar", bar: "foo" }
    }`).functionAttrReq_test_allow_array_object();
    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq allows disabled keys", () => {
    parse(`something { 
      value = {
        !i_am_disabled: "bar" 
        i_am_enabled: "foo"
      }
      other = {
        i_am_enabled: "foo"
      }
    }`).functionAttrReq_test_allow_disabled_keys();
    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq allows specific duplicates", () => {
    // foo is defined twice
    parse(`something { 
      arg = "fizz" 
      arg = "buzz" 
    }`).functionAttrReq_test_allow_duplicates();

    expect(parser.errors).to.be.empty;

    // foo is defined twice
    parse(`something { 
      arg = "fizz" 
      arg = "buzz" 
      foo = "bar"
      foo = "baz"
    }`).functionAttrReq_test_allow_duplicates();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq detects duplicates", () => {
    // foo is defined twice
    parse(`something { 
      foo = "fizz" 
      foo = "buzz" 
    }`).functionAttrReq_test_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq enforces optional requirements", () => {
    // foot is not an optional requirement
    parse(`something { 
      foot = "bar" 
    }`).functionAttrReq_test_optionals();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq enforces optional and required fields", () => {
    // all optional and required fields are present
    parse(`something {
      option = "bar"
      required = "bar"
    }`).functionAttrReq_test_optional_and_required();
    expect(parser.errors).to.be.empty;

    // optional field is missing (all good)
    parse(`something {
      required = "bar"
    }`).functionAttrReq_test_optional_and_required();

    expect(parser.errors).to.be.empty;

    // required field is missing (not good)
    parse(`something { 
      option = "bar" 
    }`).functionAttrReq_test_optional_and_required();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq enforces mock attributes as optional", () => {
    parse(`something { 
      mock = {
        "should add numbers": 5
      }
    }`).functionAttrReq_test_mocks();

    expect(parser.errors).to.be.empty;
  });

  it("functionAttrReq enforces mock attributes as required", () => {
    parse(`something { 
      value = 5
    }`).functionAttrReq_test_mocks_with_required_arg();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq enforces mock attributes as not allowed", () => {
    parse(`something { 
      mock "should add numbers" {
        value = 5
      }
    }`).functionAttrReq_test_mock_not_allowed();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq prevents multiple mock attributes with duplicate names", () => {
    parse(`something { 
      mock "should add numbers" {
        value = 5
      }
      mock "should add numbers" {
        value = 3
      }
    }`).functionAttrReq_test_mocks();

    expect(parser.errors).to.not.be.empty;
  });

  it("functionAttrReq allows multiple mock attributes with different names", () => {
    parse(`something { 
      mock = {
        "should add numbers": 5
        "should subtract numbers": 3
      }
    }`).functionAttrReq_test_mocks();

    expect(parser.errors).to.be.empty;
  });
});
