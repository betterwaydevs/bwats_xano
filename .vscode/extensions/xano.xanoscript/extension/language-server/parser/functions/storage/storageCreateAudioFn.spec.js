import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageCreateAudioFn();
  return parser;
}

describe("storage.create_audio", () => {
  it("Check create_audio is accepts a value and a filename", () => {
    const parser = parse(`create_audio {
      access = "private"
      value = $input.audio
      filename = "audio.wav"
    } as $audio`);
    expect(parser.errors).to.be.empty;
  });

  it("create_audio requires a value", () => {
    const parser = parse(`create_audio {
      access = "public"
      filename = "my_file.txt"
    } as $audio`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_audio does not require a filename", () => {
    const parser = parse(`create_audio {
      access = "public"
      value = $input.audio
    } as $audio`);
    expect(parser.errors).to.be.empty;
  });

  it("create_audio rejects duplicate attributes", () => {
    const parser = parse(`create_audio {
      access = "private"
      value = $input.audio
      value = $input.other_audio
    } as $audio`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_audio rejects illegal attributes", () => {
    const parser = parse(`create_audio {
      value = $input.audio
      filename = "audio.wav"
      illegalAttr = "value"
      access = "private"
    } as $audio`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_audio accepts description attribute", () => {
    const parser = parse(`create_audio {
      value = $input.audio
      access = "private"
      filename = "audio.wav"
      description = "A description"
    } as $audio`);
    expect(parser.errors).to.be.empty;
  });

  it("create_audio accepts disabled attribute", () => {
    const parser = parse(`create_audio {
      value = $input.audio
      access = "private"
      filename = "audio.wav"
      disabled = true
    } as $audio`);
    expect(parser.errors).to.be.empty;
  });

  it("create_audio reject invalid access", () => {
    const parser = parse(`create_audio {
      value = $input.audio
      filename = "audio.wav"
      access = "unknown"
      disabled = true
    } as $audio`);
    expect(parser.errors).to.not.be.empty;
  });

  it("create_audio reject missing access", () => {
    const parser = parse(`create_audio {
      value = $input.audio
      key = "list"
      filename = "audio.wav"
      disabled = true
    } as $audio`);
    expect(parser.errors).to.not.be.empty;
  });
});
