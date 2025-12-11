import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.columnMetadataDefinition();
  return parser;
}

describe("columnMetadataDefinition", () => {
  it("columnMetadataDefinition accepts a sensitive value", () => {
    const parser = parse(`{ 
      sensitive = true 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("columnMetadataDefinition accepts a description value", () => {
    const parser = parse(`{ 
      description = "a description" 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("columnMetadataDefinition accepts a description and a sensitive value", () => {
    const parser = parse(`{ 
      description = "a description" 
      sensitive = true 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("columnMetadataDefinition doesn't accept other fields", () => {
    const parser = parse(`{ 
      values = ["a description"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("columnMetadataDefinition cannot be empty", () => {
    const parser = parse("{\n}");
    expect(parser.errors).to.not.be.empty;
  });
});
