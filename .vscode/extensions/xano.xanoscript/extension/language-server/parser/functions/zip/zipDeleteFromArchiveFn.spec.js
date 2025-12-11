import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.zipDeleteFromArchiveFn();
  return parser;
}

describe("zipDeleteFromArchiveFn", () => {
  it("zipDeleteFromArchiveFn accepts a filename and a zip", () => {
    const parser = parse(`delete_from_archive { 
      zip = $zip_file
      filename = "some_file.zip"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipDeleteFromArchiveFn accepts a password", () => {
    const parser = parse(`delete_from_archive {
      zip = $zip_file
      filename = "some_file.zip"
      password = "foo bar"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipDeleteFromArchiveFn can be disabled", () => {
    const parser = parse(`delete_from_archive {
      zip = $zip_file
      filename = "some_file.zip"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipDeleteFromArchiveFn accept a description", () => {
    const parser = parse(`delete_from_archive {
      zip = $zip_file
      filename = "some_file.zip"
      description = "compressed data"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipDeleteFromArchiveFn does not accept an output as value", () => {
    const parser = parse(`delete_from_archive {
      zip = $zip_file
      filename = "some_file.zip"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });

  it("zipDeleteFromArchiveFn requires a filename and a zip", () => {
    let parser = parse(`delete_from_archive {
      filename = "some_file.zip"
    }`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`delete_from_archive {
      zip = $zip_file
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
