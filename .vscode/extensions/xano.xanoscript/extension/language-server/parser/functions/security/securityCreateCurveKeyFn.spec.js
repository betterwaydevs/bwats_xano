import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityCreateCurveKeyFn();
  return parser;
}

describe("securityCreateCurveKeyFn", () => {
  it("securityCreateCurveKeyFn accepts attributes and store value in a variable", () => {
    const parser = parse(`create_curve_key {
      curve = "P-256"
      format = "object"
    } as $crypto_key`);
    expect(parser.errors).to.be.empty;
  });
});
