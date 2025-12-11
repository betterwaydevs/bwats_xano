import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.streamFromJsonlFn();
  return parser;
}

describe("stream.from_jsonl", () => {
  it("Check from_jsonl is taking required params", () => {
    const input = `from_jsonl {
      value = $jsonl_file_resource
    } as $stream1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("Check from_jsonl is missing required params", () => {
    const input = `from_jsonl {
    } as $stream1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check from_jsonl has duplicate attributes", () => {
    const input = `from_jsonl {
      value = $jsonl_file_resource
      value = $another_jsonl_file
    } as $stream1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("Check from_jsonl has illegal attributes", () => {
    const input = `from_jsonl {
      value = $jsonl_file_resource
      illegalAttr = "value"
    } as $stream1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });
});
