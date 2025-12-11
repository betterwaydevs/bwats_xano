import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.conditionalFn();
  return parser;
}

describe("conditionalFn", () => {
  it("conditionalFn accept a single if statement", () => {
    const parser = parse(`conditional {
      if ($input.a == 12) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn accept a multiline if statement", () => {
    const parser = parse(`conditional {
      if (
        $input.a == 12
      ) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn accepts a comment above the if", () => {
    const parser = parse(`conditional {
        // This is a comment
        if ($input.a == 12) {
          var $x {
            value = 12
          }
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn accept an else statement", () => {
    const parser = parse(`conditional {
      if ($input.a < 12) { 
        var $x {
          value = 12
        }
      }
      else {
        var $y {
          value = 13
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn should error out when else statement is not on a new line", () => {
    const parser = parse(`conditional {
      if ($input.a < 12) { 
        var $x {
          value = 12
        }
      } else {
        var $y {
          value = 13
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("conditionalFn if and elseif can have no stack (somehow uh)", () => {
    const parser = parse(`conditional {
      if ($input.a >= 12)
      elseif ($input.a <= 13)
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn accepts many else if (elseif) statements", () => {
    const parser = parse(`conditional {
      if ($input.a < 12) { 
        var $x {
          value = 12
        }
      }
      elseif ($input.a != 13) {
        var $y {
          value = "alpha"
        }
      }
      elseif ($input.a > 14) {
        var $y {
          value = 36
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn accepts a description", () => {
    const parser = parse(`conditional {
      description = "foo"
      if ($input.a == 12) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn can be disabled", () => {
    const parser = parse(`conditional {
      disabled = true
      if ($input.a == 12) { 
        var $x {
          value = 12
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("conditionalFn requires at least an if statement", () => {
    const parser = parse(`conditional {
      description = "foo"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("conditionalFn requires ordered statement if, elseif..., else", () => {
    const parser = parse(`conditional {
      if ($input.a == 12) { 
        var $x {
          value = 12
        }
      }
      elseif ($input.a == 13) {
        var $y {
          value = "alpha"
        }
      }
      else {
        var $z {
          value = 14
        }
      }
      elseif ($input.a == 14) {
        var $y {
          value = 36
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
