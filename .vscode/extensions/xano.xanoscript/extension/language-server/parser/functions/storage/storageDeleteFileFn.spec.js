import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageDeleteFileFn();
  return parser;
}

describe("storage.delete_file", () => {
  it("Check delete_file is accepts a pathname", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("delete_file requires a pathname", () => {
    const parser = parse(`delete_file {
      description = "A description"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("delete_file rejects duplicate attributes", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
      pathname = "other_file.txt"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("delete_file rejects illegal attributes", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
      illegalAttr = "value"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("delete_file does not accept 'as' var keyword", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
    } as $deleted_file`);
    expect(parser.errors).to.not.be.empty;
  });

  it("delete_file accepts description attribute", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
      description = "A description"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("delete_file accepts disabled attribute", () => {
    const parser = parse(`delete_file {
      pathname = "foo_bar.txt"
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });
});
