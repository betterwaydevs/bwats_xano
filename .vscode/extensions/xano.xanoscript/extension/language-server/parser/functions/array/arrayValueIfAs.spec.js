import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayValueIfAs();
  return parser;
}

describe("arrayValueIfAs", () => {
  it("arrayValueIfAs accept a value build, an if expression and a return value as", () => {
    const parser = parse("($my_array|push:1) if ($this == 2) as $x2");
    expect(parser.errors).to.be.empty;
  });

  it("arrayValueIfAs also accept a disabled field", () => {
    const parser = parse(`($my_array|push:1) if ($this == 2) {
      disabled = true
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayValueIfAs accept a multiline data field", () => {
    const parser = parse(`([]
      |push:1
      |push:2
      |push:3
      |push:4
      |push:6
    ) if ($this == 2) {
      disabled = true
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayValueIfAs also accept a description field", () => {
    const parser = parse(`($my_array|push:1) if ($this == 2) {
      description = "some description"
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayValueIfAs also accept a description and a disabled field", () => {
    const parser = parse(`($my_array|push:1) if ($this == 2) {
      description = "some description"
      disabled = true
    } as $x2`);
    expect(parser.errors).to.be.empty;
  });
});
