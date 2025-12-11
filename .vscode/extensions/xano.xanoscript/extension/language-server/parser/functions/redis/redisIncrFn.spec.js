import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisIncrFn();
  return parser;
}

describe("redis.incr", () => {
  it("Check incr is taking required params", () => {
    const parser = parse(`incr {
      key = "counter"
      by = 1
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("Check incr is missing required params", () => {
    const parser = parse(`incr {
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check incr has duplicate attributes", () => {
    const parser = parse(`incr {
      key = "counter"
      key = "another_counter"
      by = 1
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check incr has illegal attributes", () => {
    const parser = parse(`incr {
      key = "counter"
      by = 1
      illegalAttr = "value"
    } as $x3`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check incr with optional description attribute", () => {
    const parser = parse(`incr {
      key = "counter"
      by = 1
      description = "Increment counter"
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("Check incr with optional disabled attribute", () => {
    const parser = parse(`incr {
      key = "counter"
      by = 1
      disabled = true
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });

  it("Check incr with both optional attributes", () => {
    const parser = parse(`incr {
      key = "counter"
      by = 1
      description = "Increment counter"
      disabled = false
    } as $x3`);
    expect(parser.errors).to.be.empty;
  });
});
