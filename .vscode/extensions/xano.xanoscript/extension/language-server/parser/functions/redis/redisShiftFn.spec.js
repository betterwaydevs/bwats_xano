import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.redisShiftFn();
  return parser;
}

describe("redis.shift", () => {
  it("Check shift is taking required params", () => {
    const parser = parse(`shift {
      key = "list"
    } as $x8`);
    expect(parser.errors).to.be.empty;
  });

  it("Check shift is missing required params", () => {
    const parser = parse(`shift {} as $x8`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check shift has duplicate attributes", () => {
    const parser = parse(`shift {
      key = "list"
      key = "another_list"
    } as $x8`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check shift has illegal attributes", () => {
    const parser = parse(`shift {
      key = "list"
      illegalAttr = "value"
    } as $x8`);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check shift with optional description attribute", () => {
    const parser = parse(`shift {
      key = "list"
      description = "This is a description"
    } as $x8`);
    expect(parser.errors).to.be.empty;
  });

  it("Check shift with optional disabled attribute", () => {
    const parser = parse(`shift {
      key = "list"
      disabled = true
    } as $x8`);
    expect(parser.errors).to.be.empty;
  });

  it("Check shift with both optional attributes", () => {
    const parser = parse(`shift {
      key = "list"
      description = "This is a description"
      disabled = true
    } as $x8`);
    expect(parser.errors).to.be.empty;
  });
});
