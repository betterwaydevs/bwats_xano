import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.addonCallFn();
  return parser;
}

describe("addonCallFn", () => {
  it("should parse addon.call statement", () => {
    const parser = parse(`addon.call my_action {
      input = {
        "key": "value"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse addon.call with a mock", () => {
    const parser = parse(`addon.call my_action {
      input = {
        "key": "value"
      }
      mock = {
        "my test": {result: "mocked_value"}
        "!disabled test": {result: "mocked_value"}
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("addon.call can be one liner without a body", () => {
    const parser = parse(`addon.call my_action as $result`);
    expect(parser.errors).to.be.empty;
  });
});
