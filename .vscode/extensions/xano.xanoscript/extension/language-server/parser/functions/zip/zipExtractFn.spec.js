import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.zipExtractFn();
  return parser;
}

describe("zipExtractFn", () => {
  it("zipExtractFn accepts a zip", () => {
    const parser = parse(`extract {
      zip = $zip_file
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipExtractFn accepts a password", () => {
    const parser = parse(`extract {
      zip = $zip_file
      password = "foo bar"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipExtractFn can be disabled", () => {
    const parser = parse(`extract {
      zip = $zip_file
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipExtractFn accept a description", () => {
    const parser = parse(`extract {
      zip = $zip_file
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipExtractFn requires a zip", () => {
    const parser = parse(`extract {
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
