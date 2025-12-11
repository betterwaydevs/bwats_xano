import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.toolCallFn();
  return parser;
}

describe("toolCallFn", () => {
  it("should parse tool.call statement", () => {
    const parser = parse(`tool.call my_agent {
      input = {
        "key": "value"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("tool.call can be one liner without a body", () => {
    const parser = parse(`tool.call my_agent as $result`);
    expect(parser.errors).to.be.empty;
  });
});
