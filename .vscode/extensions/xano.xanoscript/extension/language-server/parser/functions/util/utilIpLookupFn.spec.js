import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilIpLookupFn();
  return parser;
}

describe("utilIpLookupFn", () => {
  it("utilIpLookupFn accepts a value", () => {
    const parser = parse(`ip_lookup {
      value = "192.168.0.125"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilIpLookupFn accepts a description", () => {
    const parser = parse(`ip_lookup {
      value = "192.168.0.125"
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilIpLookupFn can be disabled", () => {
    const parser = parse(`ip_lookup {
      value = "192.168.0.125"
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });
});
