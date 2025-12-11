import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageCreateAttachmentFn();
  return parser;
}

describe("storage.create_attachment", () => {
  it("Check create_attachment is accepts a value and a filename", () => {
    const parser = parse(`create_attachment {
      access = "public"
      value = $input.image
      filename = "my_document.txt"
    } as $image`);
    expect(parser.errors).to.be.empty;
  });

  it("create_attachment requires a value", () => {
    const parser = parse(`create_attachment {
      access = "private"
      filename = "my_file.txt"
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_attachment requires a filename", () => {
    const parser = parse(`create_attachment {
      access = "private"
      value = $input.image
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_attachment rejects duplicate attributes", () => {
    const parser = parse(`create_attachment {
      access = "private"
      value = $input.image
      value = $input.other_image
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_attachment rejects illegal attributes", () => {
    const parser = parse(`create_attachment {
      access = "private"
      value = $input.image
      filename = "my_document.txt"
      illegalAttr = "value"
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_attachment accepts disabled attribute", () => {
    const parser = parse(`create_attachment {
      access = "private"
      value = $input.image
      filename = "my_document.txt"
      disabled = true
    } as $image`);
    expect(parser.errors).to.be.empty;
  });

  it("create_attachment reject invalid access", () => {
    const parser = parse(`create_attachment {
      value = $input.image
      access = "unknown"
      filename = "my_document.txt"
      disabled = true
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_attachment reject missing access", () => {
    const parser = parse(`create_attachment {
      value = $input.image
      filename = "my_document.txt"
      disabled = true
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });
});
