import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.completeErrorVariable();
  return parser;
}

describe("completeErrorVariable", () => {
  it("completeErrorVariable does not work outside a try catch block", () => {
    let parser = parse("$error.result.first");
    expect(parser.errors).to.not.be.empty;
  });
});
