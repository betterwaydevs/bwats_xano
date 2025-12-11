import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.dbBulkDeleteFn();
  return parser;
}

describe("dbBulkDeleteFn", () => {
  it("dbBulkDeleteFn accepts a where clause", () => {
    const parser = parse(`delete user {
      where = $db.donation.donor_id == 12
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("dbBulkDeleteFn accepts an as $variable", () => {
    const parser = parse(`delete "my users" {
      where = $db.donation.donor_id == 12
    } as $deletedCount`);
    expect(parser.errors).to.be.empty;
  });
});
