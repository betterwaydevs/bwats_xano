import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.zipViewContentsFn();
  return parser;
}

describe("zipViewContentsFn", () => {
  it("zipViewContentsFn accepts a filename", () => {
    const parser = parse(`view_contents {
      zip = $input.file
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipViewContentsFn accepts a password", () => {
    const parser = parse(`view_contents {
      zip = $input.file
      password = "foo bar"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipViewContentsFn can be disabled", () => {
    const parser = parse(`view_contents {
      zip = $input.file
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipViewContentsFn accept a description", () => {
    const parser = parse(`view_contents {
      zip = $input.file
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("zipViewContentsFn requires a filename", () => {
    const parser = parse(`view_contents {
      description = "compressed data"
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
