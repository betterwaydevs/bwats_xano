import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbLinkColumnDefinition();
  return parser;
}

describe("dbLinkColumnDefinition", () => {
  it("dbLinkColumnDefinition accepts a string for table value", () => {
    const parser = parse(`dblink {
      table = "book_club_meeting_registration"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbLinkColumnDefinition requires a string for table value", () => {
    const parser = parse(`dblink {
      table = 123
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("dbLinkColumnDefinition allows an override", () => {
    const parser = parse(`dblink {
      table = "user"
      override = {
        created_at: {hidden: true}
        email     : {hidden: true}
        password  : {hidden: true}
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbLinkColumnDefinition cannot be empty", () => {
    const parser = parse(`dblink {}`);
    expect(parser.errors).to.not.be.empty;
  });
});
