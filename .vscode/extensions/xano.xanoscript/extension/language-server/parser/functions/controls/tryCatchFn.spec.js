import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.tryCatchFn();
  return parser;
}

describe("tryCatchFn", () => {
  it("tryCatchFn can have an empty body", () => {
    const parser = parse(`try_catch {
      try
      catch
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn try and catch can contain a stack", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = "try"
        }
      }
    
      catch {
        var $x1 {
          value = "try"
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn allows $error", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = "try"
        }
      }
    
      catch {
        var $x1 {
          value = {
            name: $error.name
            code: $error.code
            message: $error.message
            result: $error.result
          }
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn rejects unknown $error attributes", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = "try"
        }
      }
    
      catch {
        var $x1 {
          value = $error.unknown
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("tryCatchFn rejects $error outside of catch block", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = $error.message
        }
      }
    
      catch {
        var $x1 {
          value = $error.code
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("tryCatchFn accepts a description", () => {
    const parser = parse(`try_catch {
      description = "try catch block"
      try {
        var $x1 {
          value = "try"
        }
      }
    
      catch {
        var $x1 {
          value = "try"
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn can be disabled", () => {
    const parser = parse(`try_catch {
      disabled = true
      try {
        var $x1 {
          value = "try"
        }
      }
    
      catch {
        var $x1 {
          value = "try"
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn accepts a finally block", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = "try"
        }
      }

      catch {
        var $x1 {
          value = "catch"
        }
      }

      finally {
        var $x1 {
          value = "finally"
        }
      }              
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("tryCatchFn requires a try block", () => {
    const parser = parse(`try_catch {
      catch {
        var $x1 {
          value = "try"
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("tryCatchFn requires a catch block", () => {
    const parser = parse(`try_catch {
      try {
        var $x1 {
          value = "try"
        }
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
