import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudListDirectoryFn();
  return parser;
}

describe("cloudListDirectoryFn", () => {
  it("cloudListDirectoryFn requires values and an return variable", () => {
    const parser = parse(`list_directory {
      bucket = "my_bucket"
      region = $should_be_b ? "b": "c"
      key = $input.file_key
      secret = $env.secret_key
      prefix = $env.file_prefix
      next_page_token = 4
    } as $directory`);
    expect(parser.errors).to.be.empty;
  });
});
