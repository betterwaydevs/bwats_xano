import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisRangeFn();
  return parser;
}

describe("redis.range", () => {
  it("Check range is taking required params", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      stop = 1
    } as $x10`);
    expect(parser.errors).to.be.empty;
  });

  it("Check range is missing required params", () => {
    const parser = parse(`range {
      key = "list"
    } as $x10`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check range has duplicate attributes", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      start = 1
    } as $x10`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check range has illegal attributes", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      stop = 1
      illegalAttr = "value"
    } as $x10`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check range with optional description attribute", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      stop = 1
      description = "This is a description"
    } as $x10`);
    expect(parser.errors).to.be.empty;
  });

  it("Check range with optional disabled attribute", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      stop = 1
      disabled = true
    } as $x10`);
    expect(parser.errors).to.be.empty;
  });

  it("Check range with both optional attributes", () => {
    const parser = parse(`range {
      key = "list"
      start = 0
      stop = 1
      description = "This is a description"
      disabled = true
    } as $x10`);
    expect(parser.errors).to.be.empty;
  });
});
