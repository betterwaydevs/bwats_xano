import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageCreateFileResourceFn();
  return parser;
}

describe("storage.create_file_resource", () => {
  it("Check create_file_resource is accepts a filedata and a filename", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
      filedata = $file_content
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });

  it("create_file_resource requires a filedata", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_file_resource requires a filename", () => {
    const parser = parse(`create_file_resource {
      filedata = $file_content
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_file_resource rejects duplicate attributes", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
      filedata = $file_content
      filedata = $input.other_image
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_file_resource rejects illegal attributes", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
      filedata = $file_content
      illegalAttr = "value"
    } as $file_resource`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_file_resource accepts description attribute", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
      filedata = $file_content
      description = "A description"
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });

  it("create_file_resource accepts disabled attribute", () => {
    const parser = parse(`create_file_resource {
      filename = "my_file.txt"
      filedata = $file_content
      disabled = true
    } as $file_resource`);
    expect(parser.errors).to.be.empty;
  });
});
