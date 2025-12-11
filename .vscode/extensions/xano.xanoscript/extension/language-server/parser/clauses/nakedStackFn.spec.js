import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.nakedStackFn();
  return parser;
}

describe("nakedStack", () => {
  it("nakedStack accepts as single statement", () => {
    const parser = parse(`{
  var $some_var { 
    value = "value"
  }
}`);
    expect(parser.errors).to.be.empty;
  });

  it("nakedStack accepts a disabled statement", () => {
    const parser = parse(`{
  !var $some_var { 
    value = "value"
  }
}`);

    expect(parser.errors).to.be.empty;
  });

  it("nakedStack accepts a multiline statement", () => {
    const parser = parse(`{
  var $some_var { 
    value = "value"
  }

  var.update $some_var { 
    value = "value2"
  }
}`);

    expect(parser.errors).to.be.empty;
  });

  it("nakedStack accepts a multiline comments", () => {
    const parser = parse(`{
  var $some_var { 
    value = "value"
  }

  // Comment here
  // Another comment
  
  var.update $some_var { 
    value = "value2"
  }
}`);
    expect(parser.errors).to.be.empty;
  });
});
