import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.objectColumnDefinition();
  return parser;
}

describe("objectColumnDefinition", () => {
  it("objectColumnDefinition accepts a sub schema", () => {
    const parser = parse(`object variable {
      schema {
        int rank
        object nested {
          schema {
            text label
          }
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition accepts a sub schema with multiple fields", () => {
    const parser = parse(`object variable {
      schema {
        int rank
        text label
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition accepts a description", () => {
    const parser = parse(`object variable {
      description = "This is a description"
      schema {
        text label
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition accepts a sensitivity marker", () => {
    const parser = parse(`object variable {
      sensitive = true
      schema {
        decimal value
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition can be defined as a list", () => {
    const parser = parse(`object[] variable {
      schema {
        decimal value
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition can be defined optional", () => {
    const parser = parse(`object variable? {
      sensitive = true
      schema {
        decimal value
        bool is_active
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("objectColumnDefinition cannot be defined nullable", () => {
    const parser = parse(`object? variable {
      sensitive = true
      schema {
        decimal value
        bool is_active
      }
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("objectColumnDefinition adds an input entry", () => {
    const parser = parse(`object variable? {
      sensitive = true
      schema {
        decimal value
        bool is_active
      }
    }`);

    expect(parser.__symbolTable.input).to.have.property("variable");
    expect(parser.__symbolTable.input["variable"]).to.deep.equal({
      type: "enum",
      iterable: false,
      nullable: false,
      optional: true,
    });
  });

  it("objectColumnDefinition cannot accept a file", () => {
    const parser = parse(`object variable? {
      sensitive = true
      schema {
        decimal value
        file some_file
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
