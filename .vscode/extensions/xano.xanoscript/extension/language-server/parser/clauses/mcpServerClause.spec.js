import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.mcpServerClause();
  return parser;
}

describe("mcpServerClause", () => {
  it("mcpServerClause accepts string", () => {
    const parser = parse(`mcp_server = "test"`);
    expect(parser.errors).to.be.empty;
  });

  it("mcpServerClause doesn't allow empty string with double quotes", () => {
    const parser = parse(`mcp_server = ""`);
    expect(parser.errors).to.not.be.empty;
  });

  it("mcpServerClause doesn't allow empty string with single quotes", () => {
    const parser = parse(`mcp_server = ''`);
    expect(parser.errors).to.not.be.empty;
  });

  it("mcpServerClause only allows strings (not numerical)", () => {
    const parser = parse(`mcp_server = '123'`);
    expect(parser.errors).to.not.be.empty;
  });
});
