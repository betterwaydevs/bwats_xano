import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.columnDefinition();
  return parser;
}

describe("columnDefinition", () => {
  it("columnDefinition can define an int", () => {
    const parser = parse(`int anIntegerVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition capture the input in the registry", () => {
    const parser = parse(`int anIntegerVar`);
    expect(parser.__symbolTable.input).to.deep.equal({
      anIntegerVar: {
        type: "int",
        iterable: false,
        nullable: false,
        optional: false,
      },
    });
  });

  it("columnDefinition can define a text", () => {
    const parser = parse(`text aTextVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a uuid", () => {
    const parser = parse(`uuid aTextVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a decimal", () => {
    const parser = parse(`decimal aDecimalVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a boolean", () => {
    const parser = parse(`bool aBooleanVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a date", () => {
    const parser = parse(`date aDateVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a timestamp", () => {
    const parser = parse(`timestamp aDateTimeVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a vector", () => {
    const parser = parse(`vector aVectorVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a json", () => {
    const parser = parse(`json aJsonVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a email", () => {
    const parser = parse(`email anEmailVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can define a password", () => {
    const parser = parse(`password aPasswordVar`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition accepts a sensitive marker", () => {
    const parser = parse(`password aPasswordVar {
      sensitive = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition accepts a vector size", () => {
    const parser = parse(`vector vec {
      size = 1536
    }`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.be.empty;
  });

  it("columnDefinition warns of a missing vector size", () => {
    const parser = parse(`vector vec`);
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.not.be.empty;
  });

  it("columnDefinition accepts a description", () => {
    const parser = parse(`text label {
      description = "the display name of the product"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition does not accepts non-registered filter", () => {
    const parser = parse("int age filters=whatTheHeck");
    expect(parser.errors).not.to.be.empty;
  });

  it("columnDefinition can be defined as an array", () => {
    const parser = parse(`int[] variableArray`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition captures the array input", () => {
    const parser = parse(`int[] variableArray`);
    expect(parser.__symbolTable.input).to.deep.equal({
      variableArray: {
        type: "int",
        iterable: true,
        nullable: false,
        optional: false,
      },
    });
  });

  it("columnDefinition captures optional values", () => {
    const parser = parse(`email[] variableArray?`);
    expect(parser.__symbolTable.input).to.deep.equal({
      variableArray: {
        type: "email",
        iterable: true,
        nullable: false,
        optional: true,
      },
    });
  });

  it("columnDefinition captures nullable values", () => {
    const parser = parse(`timestamp[]? variableArray`);
    expect(parser.__symbolTable.input).to.deep.equal({
      variableArray: {
        type: "timestamp",
        iterable: true,
        nullable: true,
        optional: false,
      },
    });
  });

  it("columnDefinition can reuse type as variable name", () => {
    const parser = parse(`email email`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition can be optional", () => {
    const parser = parse(`decimal variable?`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition cannot start with a number", () => {
    const parser = parse(`uuid 12variable`);
    expect(parser.errors).to.not.be.empty;
  });

  it("columnDefinition can be marked nullable", () => {
    const parser = parse(`text? variable`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition accepts a default value", () => {
    const parser = parse(`timestamp when=now`);
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition accepts a filter", () => {
    const parser = parse("text isbn? filters=trim");
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition accepts multiple filters", () => {
    const parser = parse("email email_input? filters=trim|lower");
    expect(parser.errors).to.be.empty;
  });

  it("columnDefinition rejects mismatched filters", () => {
    const parser = parse("decimal height filters=startsWith:12|max:200");
    expect(parser.errors).to.not.be.empty;
  });

  it("columnDefinition rejects non-existing filters", () => {
    const parser = parse("decimal height filters=nonExistingFilter");
    expect(parser.errors).to.not.be.empty;
  });
});
