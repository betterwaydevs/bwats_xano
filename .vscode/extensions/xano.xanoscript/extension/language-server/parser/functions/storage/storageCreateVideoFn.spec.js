import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageCreateVideoFn();
  return parser;
}

describe("storage.create_video", () => {
  it("Check create_video is accepts a value and a filename", () => {
    const parser = parse(`create_video {
      access = "private"
      value = $input.video
      filename = "video.mpg"
    } as $video`);
    expect(parser.errors).to.be.empty;
  });

  it("create_video requires a value", () => {
    const parser = parse(`create_video {
      access = "public"
      filename = "my_file.txt"
    } as $video`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_video does not require a filename", () => {
    const parser = parse(`create_video {
      access = "public"
      value = $input.video
    } as $video`);
    expect(parser.errors).to.be.empty;
  });

  it("create_video rejects duplicate attributes", () => {
    const parser = parse(`create_video {
      access = "private"
      value = $input.video
      value = $input.other_video
    } as $video`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_video rejects illegal attributes", () => {
    const parser = parse(`create_video {
      value = $input.video
      filename = "video.mpg"
      illegalAttr = "value"
      access = "private"
    } as $video`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_video accepts description attribute", () => {
    const parser = parse(`create_video {
      value = $input.video
      access = "private"
      filename = "video.mpg"
      description = "A description"
    } as $video`);
    expect(parser.errors).to.be.empty;
  });

  it("create_video accepts disabled attribute", () => {
    const parser = parse(`create_video {
      value = $input.video
      access = "private"
      filename = "video.mpg"
      disabled = true
    } as $video`);
    expect(parser.errors).to.be.empty;
  });

  it("create_video reject invalid access", () => {
    // TODO: fix the implementation to support this case
    const parser = parse(`create_video {
      value = $input.video
      filename = "video.mpg"
      access = "unknown"
      disabled = true
    } as $video`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_video reject missing access", () => {
    const parser = parse(`create_video {
      value = $input.video
      key = "list"
      filename = "video.mpg"
      disabled = true
    } as $video`);
    expect(parser.errors).to.not.be.empty;
  });
});
