import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.switchFn();
  return parser;
}

describe("switchFn", () => {
  it("switchFn can be an empty statement", () => {
    const parser = parse(`switch ($input.a)`);
    expect(parser.errors).to.be.empty;
  });
  it("switchFn accept a case statement", () => {
    const parser = parse(`switch ($input.a) {
      case (12) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn accept a default statement", () => {
    const parser = parse(`switch ($input.a) {
      default {
        var $x2 {
          value = 12212
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn accept break statement", () => {
    const parser = parse(`switch ($input.a) {
      case (12) { 
        var $x {
          value = 12
        }
      } break
      case (13) break
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn accepts a description", () => {
    const parser = parse(`switch ($input.a) {
      description = "foo"
       case (12)  { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn can be disabled", () => {
    const parser = parse(`switch ($input.a) {
      disabled = true
      case ($input.b) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn does not requires a statement", () => {
    const parser = parse(`switch ($input.a) {
      description = "foo"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("switchFn requires ordered case, case..., default", () => {
    const parser = parse(`switch ($input.a) {
      case (1) { 
        var $x {
          value = 12
        }
      }
      default {
        var $y {
          value = 36
        }
      }
      case (12) {
        var $y {
          value = "alpha"
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
