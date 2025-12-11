import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilPostProcessFn();
  return parser;
}

describe("utilPostProcessFn", () => {
  it("utilPostProcessFn can have an empty body", () => {
    const parser = parse(`post_process {
      stack 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilPostProcessFn contains a stack", () => {
    const parser = parse(`post_process {
      stack {
        util.sleep {
          value = 1000
          }
        }  
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilPostProcessFn accepts a description", () => {
    const parser = parse(`post_process {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilPostProcessFn can be disabled", () => {
    const parser = parse(`post_process {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("utilPostProcessFn requires a stack", () => {
    const parser = parse(`post_process {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
