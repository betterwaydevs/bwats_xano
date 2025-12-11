import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisRateLimitFn();
  return parser;
}

describe("redis.ratelimit", () => {
  it("Check ratelimit is taking required params", () => {
    const parser = parse(`ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
    } as $ratelimit1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check ratelimit is missing required params", () => {
    const parser = parse(`ratelimit {
      key = "list"
    } as $ratelimit1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check ratelimit has duplicate attributes", () => {
    const parser = parse(`ratelimit {
      key = "list"
      key = "another_list"
      max = 0
      ttl = 60
      error = ""
    } as $ratelimit1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check ratelimit has illegal attributes", () => {
    const parser = parse(`ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
      illegalAttr = "value"
    } as $ratelimit1`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check ratelimit with optional description attribute", () => {
    const parser = parse(`ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
      description = "This is a description"
    } as $ratelimit1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check ratelimit with optional disabled attribute", () => {
    const parser = parse(`ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
      disabled = true
    } as $ratelimit1`);
    expect(parser.errors).to.be.empty;
  });

  it("Check ratelimit with both optional attributes", () => {
    const parser = parse(`ratelimit {
      key = "list"
      max = 0
      ttl = 60
      error = ""
      description = "This is a description"
      disabled = true
    } as $ratelimit1`);
    expect(parser.errors).to.be.empty;
  });
});
