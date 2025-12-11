import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityCreateUuidFn();
  return parser;
}

describe("securityCreateUuidFn", () => {
  it("securityCreateUuidFn accepts attributes and store value in a variable", () => {
    const parser = parse(`create_uuid {
      text_password = $input.password
      hash_password = $user.password
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });

  it("securityCreateUuidFn can be a single line", () => {
    const parser = parse(`create_uuid as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
