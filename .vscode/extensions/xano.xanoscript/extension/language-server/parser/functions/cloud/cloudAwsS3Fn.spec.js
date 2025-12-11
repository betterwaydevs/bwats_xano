import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cloudAwsS3Fn();
  return parser;
}

describe("cloudAwsS3Fn", () => {
  it("cloudAwsS3Fn requires a value and an return value", () => {
    const parser = parse(`s3.read_file {
        bucket = "foo"
    } as $myFile`);
    expect(parser.errors).to.be.empty;
  });
});
