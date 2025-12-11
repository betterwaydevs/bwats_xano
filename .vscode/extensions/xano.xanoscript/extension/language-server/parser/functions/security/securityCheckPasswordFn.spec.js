import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.securityCheckPasswordFn();
  return parser;
}

describe("securityCheckPasswordFn", () => {
  it("securityCheckPasswordFn accepts attributes and store value in a variable", () => {
    const parser = parse(`check_password {
      text_password = $input.password
      hash_password = $user.password
    } as $password_is_valid`);
    expect(parser.errors).to.be.empty;
  });
});
