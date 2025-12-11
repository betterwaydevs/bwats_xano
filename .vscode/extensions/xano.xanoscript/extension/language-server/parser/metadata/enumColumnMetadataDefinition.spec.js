import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.enumColumnMetadataDefinition();
  return parser;
}

describe("enumColumnMetadataDefinition", () => {
  it("enumColumnMetadataDefinition requires a values field", () => {
    const parser = parse(`{ 
      sensitive = true 
      description = "a description" 
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("enumColumnMetadataDefinition accepts a sensitive value", () => {
    const parser = parse(`{ 
      values = ["active", "inactive", "unknown"]
      sensitive = true 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnMetadataDefinition accepts a description value", () => {
    const parser = parse(`{ 
      values = ["active", "inactive", "unknown"]
      description = "a description" 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnMetadataDefinition accepts a description and a sensitive value", () => {
    const parser = parse(`{ 
      description = "a description" 
      sensitive = true 
      values = ["active", "inactive", "unknown"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("enumColumnMetadataDefinition does not accept other fields", () => {
    const parser = parse(`{ 
      values = ["active", "inactive", "unknown"]
      something = true
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("enumColumnMetadataDefinition cannot be empty", () => {
    const parser = parse("{\n}");
    expect(parser.errors).to.not.be.empty;
  });
});
