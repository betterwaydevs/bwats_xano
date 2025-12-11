import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisKeysFn();
  return parser;
}

describe("redis.keys", () => {
  it("Check keys is taking required params", () => {
    const parser = parse(`keys {
            search = "user*"
        } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check keys is missing required params", () => {
    const parser = parse(`keys {} as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check keys has duplicate attributes", () => {
    const parser = parse(`keys {
            search = "user*"
            search = "name"
        } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check keys has illegal attributes", () => {
    const parser = parse(`keys {
            search = "user*"
            illegalAttr = "value"
        } as $x1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check keys with optional description attribute", () => {
    const parser = parse(`keys {
            search = "user*"
            description = "This is a description"
        } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check keys with optional disabled attribute", () => {
    const parser = parse(`keys {
            search = "user*"
            disabled = true
        } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check keys with both optional attributes", () => {
    const parser = parse(`keys {
            search = "user*"
            description = "This is a description"
            disabled = true
        } as $x1`);
    expect(parser.errors).to.be.empty;
  });
});
