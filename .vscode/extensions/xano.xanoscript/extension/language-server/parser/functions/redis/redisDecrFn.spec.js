import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisDecrFn();
  return parser;
}

describe("redis.decr", () => {
  it("Check decr is taking required params", () => {
    const parser = parse(`decr {
      key = "counter"
      by = 1
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("Check decr is missing required params", () => {
    const parser = parse(`decr {
      key = "counter"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check decr has duplicate attributes", () => {
    const parser = parse(`decr {
      key = "counter"
      key = "another_counter"
      by = 1
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check decr has illegal attributes", () => {
    const parser = parse(`decr {
      key = "counter"
      by = 1
      illegalAttr = "value"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
