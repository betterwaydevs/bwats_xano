import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.streamFromCsvFn();
  return parser;
}

describe("stream.from_csv", () => {
  it("Check from_csv is taking required params", () => {
    const input = `from_csv {
      value = $file
      separator = ","
      enclosure = "'"
      escape_char = "'"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check from_csv is missing required params", () => {
    const input = `from_csv {
      value = ""
      separator = ","
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check from_csv has duplicate attributes", () => {
    const input = `from_csv {
      value = $file
      value = $another_file
      separator = ","
      enclosure = "'"
      escape_char = "'"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check from_csv has illegal attributes", () => {
    const input = `from_csv {
      value = $file
      separator = ","
      enclosure = "'"
      escape_char = "'"
      illegalAttr = "value"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check from_csv with different separator", () => {
    const input = `from_csv {
      value = $file
      separator = ";"
      enclosure = "'"
      escape_char = "'"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });
});
