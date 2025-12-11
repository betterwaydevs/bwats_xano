import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisHasFn();
  return parser;
}

describe("redis.has", () => {
  it("Check has is taking required params", () => {
    const parser = parse(`has {
      key = "name"
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check has is missing required params", () => {
    const parser = parse(`has {} as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check has has duplicate attributes", () => {
    const parser = parse(`has {
      key = "name"
      key = "another_name"
    } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check has has illegal attributes", () => {
    const parser = parse(`has {
      key = "name"
      illegalAttr = "value"
    } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check has is missing description attribute", () => {
    const parser = parse(`has {
      key = "name"
      description = "A description"
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check has is missing disabled attribute", () => {
    const parser = parse(`has {
      key = "name"
      disabled = true
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });
});
