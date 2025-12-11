import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.zipCreateArchiveFn();
  return parser;
}

describe("zipCreateArchiveFn", () => {
  it("zipCreateArchiveFn accepts a filename", () => {
    const parser = parse(`create_archive {
      filename = "some_file.zip"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipCreateArchiveFn accepts a password", () => {
    const parser = parse(`create_archive {
      filename = "some_file.zip"
      password = "foo bar"
      password_encryption = "standard"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipCreateArchiveFn can be disabled", () => {
    const parser = parse(`create_archive {
      filename = "some_file.zip"
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipCreateArchiveFn accept a description", () => {
    const parser = parse(`create_archive {
      filename = "some_file.zip"
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipCreateArchiveFn requires a filename", () => {
    const parser = parse(`create_archive {
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
