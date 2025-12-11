import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.workflowExpectToThrowFn();
  return parser;
}

describe("workflowExpectToThrowFn", () => {
  it("workflowExpectToThrowFn accepts data field", () => {
    const parser = parse(`to_throw {
      exception = "error"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToThrowFn accepts an empty payload", () => {
    const parser = parse(`to_throw`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToThrowFn accepts a stack", () => {
    const parser = parse(`to_throw {
      exception = "error"
      stack {
        var $x1 {
          value = 12
        }

        function.run my_function {
          input = { key: $x1 }
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("workflowExpectToThrowFn does not accept an operand", () => {
    const parser = parse(`to_throw ($response.x) {
      value = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("workflowExpectToThrowFn rejects an expression", () => {
    const parser = parse(`to_throw {
        exception = $var.exception
      }`);
    expect(parser.errors).to.not.be.empty;
  });
});
