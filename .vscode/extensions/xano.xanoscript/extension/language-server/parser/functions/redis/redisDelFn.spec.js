import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisDelFn();
  return parser;
}

describe("redis.del", () => {
  it("Check del is taking required params", () => {
    const parser = parse(`del {
      key = "name"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("Check del is missing required params", () => {
    const parser = parse(`del {}`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check del has duplicate attributes", () => {
    const parser = parse(`del {
      key = "name"
      key = "another_name"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check del has illegal attributes", () => {
    const parser = parse(`del {
      key = "name"
      illegalAttr = "value"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check del is taking description and disabled attributes", () => {
    const parser = parse(`del {
      key = "name"
      description = "This is a test description"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("Check del doesn't return value as variable", () => {
    const parser = parse(`del {
      key = "name"
    } as $deleted`);
    expect(parser.errors).to.not.be.empty;
  });
});
