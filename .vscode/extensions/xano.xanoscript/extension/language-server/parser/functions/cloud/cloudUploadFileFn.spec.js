import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudUploadFileFn();
  return parser;
}

describe("cloudUploadFileFn", () => {
  it("cloudUploadFileFn requires values and an return variable", () => {
    const parser = parse(`upload_file {
      bucket = "my_bucket"
      region = $should_be_b ? "b" : "c"
      key = $input.file_key
      secret = $env.secret_key
      file_key = "e"
      file = $input.file
      metadata = {}|set:"foo":"bar"
      object_lock_mode = ""
      object_lock_retain_until = ""
    } as $foo`);
    expect(parser.errors).to.be.empty;
  });
});
