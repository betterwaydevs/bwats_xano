import { expect } from "chai";
import { describe, it } from "mocha";
import { EqualToken } from "../../lexer/control.js";
import { lexDocument } from "../../lexer/lexer.js";
import { Identifier } from "../../lexer/tokens.js";
import { parser } from "../test_parser.js";

export function parserExtension() {
  // this rule requires a foo field to be defined
  this.arrayOfObjectAttrReq_test_required = this.RULE(
    "arrayOfObjectAttrReq_test_required",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.arrayOfObjectAttrReq, { ARGS: [name, ["foo"]] });
    }
  );

  this.arrayOfObjectAttrReq_test_optionals = this.RULE(
    "arrayOfObjectAttrReq_test_optionals",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.arrayOfObjectAttrReq, {
        ARGS: [name, [], ["foo", "bar"]],
      });
    }
  );

  this.arrayOfObjectAttrReq_test_index = this.RULE(
    "arrayOfObjectAttrReq_test_index",
    () => {
      const parent = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.arrayOfObjectAttrReq, {
        ARGS: [
          parent,
          ["type", "field"],
          [],
          {
            types: {
              type: "string",
            },
          },
        ],
      });
    }
  );

  this.arrayOfObjectAttrReq_test_recursive_value = this.RULE(
    "test_recursive_value",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.arrayOfObjectAttrReq, {
        ARGS: [
          name,
          ["name", "as", "input"],
          ["addon"],
          { recursive: ["addon"] },
        ],
      });
    }
  );
  this.arrayOfObjectAttrReq_test_recursive_array_addon = this.RULE(
    "test_recursive_array_addon",
    () => {
      const name = this.CONSUME(Identifier);
      this.CONSUME(EqualToken); // "="
      this.SUBRULE(this.arrayOfObjectAttrReq, {
        ARGS: [
          name,
          ["name", "as", "input"],
          ["addon"],
          { recursiveArray: ["addon"] },
        ],
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

describe("arrayOfObjectAttrReq", () => {
  it("arrayOfObjectAttrReq accepts required attribute", () => {
    parse(`something = [ {foo: "true"}]`).arrayOfObjectAttrReq_test_required();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq accepts multilines attributes", () => {
    parse(`something = [ 
      {
        foo: true
        bar: 12
      }
    ]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq accepts list of single lines", () => {
    parse(`something = [ 
      {foo: true, bar: 12}
    ]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq accepts multiple values", () => {
    parse(`something = [ 
      {
        foo: true
      }
      {
        bar: 12
      }
    ]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;

    parse(
      `something = [{ foo: true }, {bar: 12}]`
    ).arrayOfObjectAttrReq_test_optionals();
  });

  it("arrayOfObjectAttrReq detects missing required attribute", () => {
    parse(`something = [ {}]`).arrayOfObjectAttrReq_test_required();
    expect(parser.errors).to.not.be.empty;
  });

  it("arrayOfObjectAttrReq allow for recursive definition", () => {
    parse(`addon = [
      {
        name : "client"
        as   : "_client"
        input: {client_id: ""}
        addon: {
          name : "client"
          as   : "_client"
          input: {client_id: ""}
          addon: {
            name : "client"
            as   : "_client"
            input: {client_id: ""}
          }
        }
      }
    ]`).arrayOfObjectAttrReq_test_recursive_value();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq detects missing definition on recursive attributes", () => {
    parse(`addon = [
      {
        name : "client"
        as   : "_client"
        input: {client_id: ""}
        addon: {
          name : "client"
          input: {client_id: ""}
        }
      }
    ]`).arrayOfObjectAttrReq_test_recursive_value();
    expect(parser.errors).to.not.be.empty;
  });

  it("arrayOfObjectAttrReq allow for recursive array", () => {
    parse(`addon = [
      {
        name : "client"
        as   : "_client"
        input: {client_id: ""}
        addon: [
          {
            name : "client"
            as   : "_client"
            input: {client_id: ""}
            addon: [
              {
                name : "client"
                as   : "_client"
                input: {client_id: ""}
                addon: []
              }
            ]
          }
        ]
      }
    ]`).arrayOfObjectAttrReq_test_recursive_array_addon();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq detects missing definition on recursive array", () => {
    parse(`addon = [
      {
        name : "client"
        as   : "_client"
        input: {client_id: ""}
        addon: [
          {
            name : "client"
            input: {client_id: ""}
          }
        ]
      }
    ]`).arrayOfObjectAttrReq_test_recursive_array_addon();
    expect(parser.errors).to.not.be.empty;
  });

  it("arrayOfObjectAttrReq accepts optional attributes", () => {
    parse(`something = [{}]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;

    parse(`something = [{foo: true}]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;

    parse(`something = [{bar: "ok"}]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;

    parse(
      `something = [{bar: "ok", "foo": 12.1}]`
    ).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;

    parse(`something = [
      {bar: "ok", "foo": 12.1},
      {bar: "ok", "foo": 12.1}
    ]`).arrayOfObjectAttrReq_test_optionals();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq can be used for single line index clause", () => {
    parse(
      `index = [{type: "primary", field: [{name: "id"}]}]`
    ).arrayOfObjectAttrReq_test_index();
    expect(parser.errors).to.be.empty;
  });

  it("arrayOfObjectAttrReq can be used for index clause", () => {
    parse(`index = [
      {type: "primary", field: [{name: "id"}]}
      {type: "gin", field: [{name: "xdo", op: "jsonb_path_op"}]}
      {type: "btree", field: [{name: "created_at", op: "desc"}]}
    ]`).arrayOfObjectAttrReq_test_index();
    expect(parser.errors).to.be.empty;

    parse(`index = [
      {type: "primary", field: [{name: "id"}]}
    ]`).arrayOfObjectAttrReq_test_index();
    expect(parser.errors).to.be.empty;
  });
});
