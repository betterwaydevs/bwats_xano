import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.schemaClause();
  return parser;
}

describe("schemaClause", () => {
  it("schemaClause accepts a field", () => {
    const parser = parse(`schema {
        int rank
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause accepts a comment above a field", () => {
    const parser = parse(`schema {
        // some comment
        int rank
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause accepts multiple fields", () => {
    const parser = parse(`schema {
        int rank
        text label
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause does not require curlies", () => {
    const parser = parse(`schema`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause accepts a description", () => {
    const parser = parse(`schema {
      text label {
        description = "This is a description"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause field accepts a file type", () => {
    const parser = parse(`schema {
        file my_file?
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("schemaClause field accepts a sensitivity marker", () => {
    const parser = parse(`schema {
      decimal value {
        sensitive = true
      }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
