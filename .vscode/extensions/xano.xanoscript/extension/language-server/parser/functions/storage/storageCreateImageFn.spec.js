import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageCreateImageFn();
  return parser;
}

describe("storage.create_image", () => {
  it("Check create_image is accepts a value and a filename", () => {
    const parser = parse(`create_image {
      access = "private"
      value = $input.image
      filename = "image.jpg"
    } as $image`);
    expect(parser.errors).to.be.empty;
  });

  it("create_image requires a value", () => {
    const parser = parse(`create_image {
      access = "public"
      filename = "my_file.txt"
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_image requires a filename", () => {
    const parser = parse(`create_image {
      access = "public"
      value = $input.image
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_image rejects duplicate attributes", () => {
    const parser = parse(`create_image {
      access = "private"
      value = $input.image
      value = $input.other_image
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_image rejects illegal attributes", () => {
    const parser = parse(`create_image {
      value = $input.image
      filename = "image.jpg"
      illegalAttr = "value"
      access = "private"
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_image accepts description attribute", () => {
    const parser = parse(`create_image {
      value = $input.image
      access = "private"
      filename = "image.jpg"
      description = "A description"
    } as $image`);
    expect(parser.errors).to.be.empty;
  });

  it("create_image accepts disabled attribute", () => {
    const parser = parse(`create_image {
      value = $input.image
      access = "private"
      filename = "image.jpg"
      disabled = true
    } as $image`);
    expect(parser.errors).to.be.empty;
  });

  it("create_image reject invalid access", () => {
    const parser = parse(`create_image {
      value = $input.image
      filename = "image.jpg"
      access = "unknown"
      disabled = true
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_image reject missing access", () => {
    const parser = parse(`create_image {
      value = $input.image
      key = "list"
      filename = "image.jpg"
      disabled = true
    } as $image`);
    expect(parser.errors).to.not.be.empty;
  });
});
