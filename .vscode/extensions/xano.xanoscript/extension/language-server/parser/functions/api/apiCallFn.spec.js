import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.apiCallFn();
  return parser;
}

describe("apiCallFn", () => {
  it("apiCallFn accepts url and verb field", () => {
    const parser = parse(`call foo verb=POST {
      api_group = "my_api"
      input = { a: 1}
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("apiCallFn accepts interpolated url and verb field", () => {
    const parser = parse(`call "foo/{foo_id}" verb=POST {
      api_group = "my_api"
      input = { foo_id: 1}
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("apiCallFn can be disabled", () => {
    const parser = parse(`call foo verb=PUT {
      api_group = "my_api"
      input = { a: 1}
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("apiCallFn accepts a description", () => {
    const parser = parse(`call foo verb=GET {
      description = "request function"
      api_group = "my_api"
      input = { a: 1}
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("apiCallFn requires a url and method field", () => {
    let parser = parse(`request {
      url = "https://www.example.com"
    } as $user`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`request {
      method = "GET"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
