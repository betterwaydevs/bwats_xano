import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.actionCallFn();
  return parser;
}

describe("actionCallFn", () => {
  it("should parse action.call statement", () => {
    const parser = parse(`action.call my_action {
      input = {
        "key": "value"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("should accept a package name", () => {
    const parser = parse(`action.call my_action {
      package = "com.example.package"
      input = {
        "key": "value"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("action.call can be one liner without a body", () => {
    const parser = parse(`action.call my_action as $result`);
    expect(parser.errors).to.be.empty;
  });

  it("action.call accepts a registry", () => {
    const parser = parse(`action.call my_agent {
      input = {
        "key": "value"
      }
      registry = {
        url: "https://registry.example.com",
        token: "secrettoken"
      }
    } as $result`);
    expect(parser.errors).to.be.empty;
  });
});
