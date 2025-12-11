import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.enumColumnDefinition();
  return parser;
}

describe("enumColumnDefinition", () => {
  it("enumColumnDefinition accepts an array of string values", () => {
    const parser = parse(`enum variable {
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition accepts a default value", () => {
    const parser = parse(`enum variable?=if_null {
      values = ["1", "2", "if_null"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition accepts a sensitive marker", () => {
    const parser = parse(`enum variable {
      sensitive = true
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition accepts a description", () => {
    const parser = parse(`enum variable {
      description = "some description goes here"
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition adds the enum to the $input registry", () => {
    const parser = parse(`enum[] variable? {
      description = "some description goes here"
      values = ["1", "2", "3"]
    }`);

    expect(parser.errors).to.be.empty;
    expect(parser.__symbolTable.input).to.have.property("variable");
    expect(parser.__symbolTable.input["variable"]).to.deep.equal({
      type: "enum",
      iterable: true,
      nullable: false,
      optional: true,
    });
  });

  it("enumColumnDefinition can have an empty values array", () => {
    const parser = parse(`enum variable {
      values = []
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition can be defined as an array of enums", () => {
    const parser = parse(`enum[] variable {
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition can be optional", () => {
    const parser = parse(`enum variable? {
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition cannot start with a number", () => {
    const parser = parse(`enum 12variable {
      values = ["1", "2", "3"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("enumColumnDefinition can be marked nullable", () => {
    const parser = parse(`enum? variable {
      values = ["am", "nullable"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnDefinition accepts multiple values in the values array", () => {
    const parser = parse(`enum order_status? {
      values = [
        "draft",
        "confirmed",
        "fulfilling",
        "shipping",
        "delivered",
        "returned"
      ]
    }`);
    expect(parser.errors).to.be.empty;
  });
});
