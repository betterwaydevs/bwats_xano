import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisSetFn();
  return parser;
}

describe("redis.set", () => {
  it("Check set is taking required params", () => {
    const input = `set {
      key = "name"
      data = "xano"
      ttl = 0
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check set is taking optional params", () => {
    const input = `set {
      key = "name"
      data = "xano"
      ttl = 0
      description = "foo"
      disabled = true
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check set is missing required params", () => {
    const input = `set {
      key = "name"
      data = "xano"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check set has duplicate attributes", () => {
    const input = `set {
      key = "name"
      key = "another_name"
      data = "xano"
      ttl = 0
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check set has illegal attributes", () => {
    const input = `set {
      key = "name"
      data = "xano"
      ttl = 0
      illegalAttr = "value"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check set description attribute works", () => {
    const input = `set {
      key = "name"
      data = "xano"
      ttl = 0
      description = "foo"
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check set disabled attribute works", () => {
    const input = `set {
      key = "name"
      data = "xano"
      ttl = 0
      disabled = true
    }`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });
});
