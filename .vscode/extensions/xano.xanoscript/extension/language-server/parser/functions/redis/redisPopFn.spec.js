import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisPopFn();
  return parser;
}

describe("redis.pop", () => {
  it("Check pop is taking required params", () => {
    const parser = parse(`pop {
      key = "list"
    } as $x7`);
    expect(parser.errors).to.be.empty;
  });

  it("Check pop is missing required params", () => {
    const parser = parse(`pop {} as $x7`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check pop has duplicate attributes", () => {
    const parser = parse(`pop {
      key = "list"
      key = "another_list"
    } as $x7`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check pop has illegal attributes", () => {
    const parser = parse(`pop {
      key = "list"
      illegalAttr = "value"
    } as $x7`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check pop with optional description attribute", () => {
    const parser = parse(`pop {
      key = "list"
      description = "This is a description"
    } as $x7`);
    expect(parser.errors).to.be.empty;
  });

  it("Check pop with optional disabled attribute", () => {
    const parser = parse(`pop {
      key = "list"
      disabled = true
    } as $x7`);
    expect(parser.errors).to.be.empty;
  });

  it("Check pop with both optional attributes", () => {
    const parser = parse(`pop {
      key = "list"
      description = "This is a description"
      disabled = true
    } as $x7`);
    expect(parser.errors).to.be.empty;
  });
});
