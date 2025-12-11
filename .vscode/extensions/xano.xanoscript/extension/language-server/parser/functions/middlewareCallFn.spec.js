import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.middlewareCallFn();
  return parser;
}

describe("middlewareCallFn", () => {
  it("should parse middleware.call statement", () => {
    const parser = parse(`middleware.call my_action {
      input = {
        "vars": {
          "key": "value"
        },
        "type": "pre"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("middleware.call requires inputs", () => {
    const parser = parse(`middleware.call my_action as $result`);
    expect(parser.errors).to.not.be.empty;
  });

  it("middleware.call accepts a description", () => {
    const parser = parse(`middleware.call my_agent {
      description = "This is a middleware call"
      input = {
        "vars": {
          "key": "value"
        },
        "type": "post"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });
});
