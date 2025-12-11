import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.completeAuthVariable();
  return parser;
}

describe("completeAuthVariable", () => {
  it("completeAuthVariable accepts auth variable", () => {
    const parser = parse("$auth.user_id");
    expect(parser.errors).to.be.empty;
  });

  it("completeAuthVariable accepts auth variable with custom properties", () => {
    const parser = parse("$auth.custom.property.name");
    expect(parser.errors).to.be.empty;
  });
});
