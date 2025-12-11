import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.groupFn();
  return parser;
}

describe("groupFn", () => {
  it("groupFn can have an empty body", () => {
    const parser = parse(`group {
      stack 
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("groupFn contains a stack", () => {
    const parser = parse(`group {
      stack {
        util.sleep {
          value = 1000
          }
        }  
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("groupFn accepts a description", () => {
    const parser = parse(`group {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("groupFn can be disabled", () => {
    const parser = parse(`group {
      stack {
        util.sleep {
          value = 1000
        }
      }  
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("groupFn requires a stack", () => {
    const parser = parse(`group {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
