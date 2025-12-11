import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageReadFileResourceFn();
  return parser;
}

describe("storage.read_file_resource", () => {
  it("Check read_file_resource is accepts a value and a filename", () => {
    const parser = parse(`read_file_resource {
      value = $input.image
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });

  it("read_file_resource requires a value", () => {
    const parser = parse(`read_file_resource {
      description = "my_file.txt"
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("read_file_resource rejects duplicate attributes", () => {
    const parser = parse(`read_file_resource {
      value = $input.image
      value = $input.other_image
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("read_file_resource rejects illegal attributes", () => {
    const parser = parse(`read_file_resource {
      value = $input.image
      illegalAttr = "value"
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("read_file_resource accepts description attribute", () => {
    const parser = parse(`read_file_resource {
      value = $input.image
      description = "A description"
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });

  it("read_file_resource accepts disabled attribute", () => {
    const parser = parse(`read_file_resource {
      value = $input.image
      disabled = true
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });
});
