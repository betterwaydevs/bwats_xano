import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.inputClause();
  return parser;
}

describe("inputClause", () => {
  it("inputClause accepts filters and field definition", () => {
    const parser = parse(`input {
    email email_input? filters=trim|lower
  }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause can be empty", () => {
    const parser = parse(`input`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause field accepts a description as a comment", () => {
    const parser = parse(`input {
        // this is a label
        text label

        // another comment
        int rank
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause accepts a description", () => {
    const parser = parse(`input {
        text label {
          description = "This is a description"
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause field accepts a sensitivity marker", () => {
    const parser = parse(`input {
        decimal value {
          sensitive = true
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause field accepts a file type", () => {
    const parser = parse(`input {
        dblink {
          table = "book_club_meeting_registration"
        }
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause field accepts dblink definition", () => {
    const parser = parse(`input {
        file my_file?
      }`);
    expect(parser.errors).to.be.empty;
  });

  it("inputClause accepts multiple fields", () => {
    const parser = parse(`input {
            int rank
            text label
          }`);
    expect(parser.errors).to.be.empty;
  });
});
