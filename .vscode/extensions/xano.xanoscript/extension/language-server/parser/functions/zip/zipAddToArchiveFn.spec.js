import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.zipAddToArchiveFn();
  return parser;
}

describe("zipAddToArchiveFn", () => {
  it("zipAddToArchiveFn accepts a file and a zip", () => {
    const parser = parse(`add_to_archive {
      file = $input.file
      zip = $zip_file
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipAddToArchiveFn accepts a password", () => {
    const parser = parse(`add_to_archive {
      file = $input.file
      zip = $zip_file
      password = "foo bar"
      password_encryption = "standard"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipAddToArchiveFn can be disabled", () => {
    const parser = parse(`add_to_archive {
      file = $input.file
      zip = $zip_file
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipAddToArchiveFn accept an optional filename", () => {
    const parser = parse(`add_to_archive {
      file = $input.file
      zip = $zip_file
      filename = "new_file.txt"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipAddToArchiveFn accept a description", () => {
    const parser = parse(`add_to_archive {
      file = $input.file
      zip = $zip_file
      description = "compressed data"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("zipAddToArchiveFn does not accept an output as value", () => {
    const parser = parse(`add_to_archive {
      filename = "some_file.zip"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });

  it("zipAddToArchiveFn requires a file and a zip", () => {
    let parser = parse(`add_to_archive {
      zip = $zip_file
    }`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`add_to_archive {
      file = $input.file
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
