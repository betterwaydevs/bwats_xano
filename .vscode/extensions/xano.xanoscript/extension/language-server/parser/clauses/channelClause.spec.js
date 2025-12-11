import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.channelClause();
  return parser;
}

describe("channelClause", () => {
  it("channelClause accepts string", () => {
    const parser = parse(`channel = "test"`);
    expect(parser.errors).to.be.empty;
  });

  it("channelClause doesn't allow empty string with double quotes", () => {
    const parser = parse(`channel = ""`);
    expect(parser.errors).to.not.be.empty;
  });

  it("channelClause doesn't allow empty string with single quotes", () => {
    const parser = parse(`channel = ''`);
    expect(parser.errors).to.not.be.empty;
  });

  it("channelClause only allows strings (not numerical)", () => {
    const parser = parse(`channel = '123'`);
    expect(parser.errors).to.not.be.empty;
  });
});
