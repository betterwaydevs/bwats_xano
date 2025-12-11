import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudGetFileInfoFn();
  return parser;
}

describe("cloudGetFileInfoFn", () => {
  it("cloudGetFileInfoFn requires values and an return variable", () => {
    const parser = parse(`get_file_info {
      bucket = "my_bucket"
      region = $should_be_b ? "b" : "c"
      key = $input.file_key
      secret = $env.secret_key
      file_key = "e"
    } as $file_info`);
    expect(parser.errors).to.be.empty;
  });
});
