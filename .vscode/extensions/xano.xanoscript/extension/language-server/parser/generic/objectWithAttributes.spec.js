import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

export function parserExtension() {
  // this rule has no required fields and two optional fields
  this.objectWithAttributes_test_object_query = this.RULE(
    "objectWithAttributes_test_test_object_with_attr_query",
    () => {
      this.SUBRULE(this.objectWithAttributes, {
        ARGS: [{ allowQueryExpression: true }],
      });
    }
  );

  this.objectWithAttributes_basic = this.RULE(
    "objectWithAttributes_test_object_with_attr",
    () => {
      this.SUBRULE(this.objectWithAttributes);
    }
  );

  this.objectWithAttributes_disabledKeys = this.RULE(
    "objectWithAttributes_disabledKeys",
    () => {
      this.SUBRULE(this.objectWithAttributes, {
        ARGS: [{ allowDisabledKeys: true }],
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
describe("objectWithAttributes", () => {
  it("objectWithAttributes accepts an object with attributes", () => {
    parse(`{ value: "test"}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes enforces unique keys", () => {
    parse(`{ value: "test", value: "test2"}`).objectWithAttributes_basic();
    expect(parser.errors).to.not.be.empty;
  });

  it("objectWithAttributes passes options to its children", () => {
    parse(`{ value: "test", value: "test2"}`).objectWithAttributes_basic();
    expect(parser.errors).to.not.be.empty;
  });
  it("objectWithAttributes accepts an object with object as a value", () => {
    parse(`{ value: { name: "john"}}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts a boolean value", () => {
    parse(`{ value: false}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts null value", () => {
    parse(`{ value: null}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts multiple values", () => {
    parse(`{ value: null, other: "test"}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes reject multiple values without a separator", () => {
    parse(`{ value: null other: "test"}`).objectWithAttributes_basic();
    expect(parser.errors).to.not.be.empty;
  });

  it("objectWithAttributes accepts a trailing commas", () => {
    parse(`{ value: null, other: "test",}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes can be on a new line", () => {
    parse(`{ 
      value: null, other: "test",
    }`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts an empty object", () => {
    parse(`{ }`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts a query object", () => {
    parse(`{ 
      foo: $db.order.foo
      bar: $db.book.bar|concat:"test"
    }`).objectWithAttributes_test_object_query();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes reject non query filters object", () => {
    parse(`{ 
      foo: [12,3]|pop
      bar: $db.book.bar
    }`).objectWithAttributes_test_object_query();
    expect(parser.errors).to.not.be.empty;
  });

  it("objectWithAttributes accepts multiple line object separated with new lines", () => {
    parse(`{
      value: null
      other: "test"
    }`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts multiple line object separated with new lines", () => {
    parse(`{
      value: null
      !other: "test"
    }`).objectWithAttributes_disabledKeys();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts combined single and multiple line object separated with commas", () => {
    parse(`{
      value: null, other: "test",
      something: "test", 
      "another value": 12


      someone: "test", and: $var.Blah


      foo: "bar"}`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });

  it("objectWithAttributes accepts an array as value ", () => {
    parse(`{ values: [1, 2, 3] }`).objectWithAttributes_basic();
    expect(parser.errors).to.be.empty;
  });
});
