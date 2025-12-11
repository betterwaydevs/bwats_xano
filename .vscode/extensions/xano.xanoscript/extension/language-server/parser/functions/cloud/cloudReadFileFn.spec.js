import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudReadFileFn();
  return parser;
}

describe("cloudReadFileFn", () => {
  it("cloudReadFileFn requires values and an return variable", () => {
    const parser = parse(`read_file {
      bucket = "my_bucket"
      region = $should_be_b ? "b" : "c"
      key = $input.file_key
      secret = $env.secret_key
      file_key = "e"
    } as $file`);
    expect(parser.errors).to.be.empty;
  });
});
