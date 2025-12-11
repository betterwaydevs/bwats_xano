import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayNoValueAs();
  return parser;
}

describe("arrayNoValueAs", () => {
  it("arrayNoValueAs requires return value", () => {
    const parser = parse(`as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayNoValueAs also accept a disabled field", () => {
    const parser = parse(`{
      disabled = true
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayNoValueAs also accept a description field", () => {
    const parser = parse(`{
      description = "some description"
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayNoValueAs also accept a description and a disabled field", () => {
    const parser = parse(`{
      description = "some description"
      disabled = true
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayNoValueAs requires a return value", () => {
    const parser = parse(`{
      description = "some description"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("arrayNoValueAs does not accept a value", () => {
    const parser = parse(`{
      value = $var.email
      description = "some description"
    } as $_foo`);
    expect(parser.errors).to.not.be.empty;
  });
});
