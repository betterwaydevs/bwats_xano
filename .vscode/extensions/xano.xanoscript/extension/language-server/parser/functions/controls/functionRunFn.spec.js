import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.functionRunFn();
  return parser;
}

describe("functionRunFn", () => {
  it("functionRunFn accepts data field", () => {
    const parser = parse(`function.run add {
      input = {a: $input.a, b: $b}
    } as $func1`);
    expect(parser.errors).to.be.empty;
  });

  it("functionRunFn accepts a string for function name", () => {
    const parser = parse(`function.run "my/function" {
      input = {a: $input.a, b: $b}
    } as $func1`);
    expect(parser.errors).to.be.empty;
  });

  it("functionRunFn can be disabled", () => {
    const parser = parse(`function.run add {
      input = {a: $input.a, b: $b}
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("functionRunFn can call a function in a folder", () => {
    const parser = parse(`function.run "math/add" {
      input = {a: $input.a, b: $b}
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("functionRunFn can call requires quote when calling a function in a folder", () => {
    const parser = parse(`function.run math/add {
      input = {a: $input.a, b: $b}
    } as $new_user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("functionRunFn rejects input that is not an object", () => {
    const parser = parse(`function.run math/add {
      input = $input
    } as $new_user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("functionRunFn accepts a description", () => {
    const parser = parse(`function.run add {
      description = "run a function"
      input = {a: $input.a, b: $b}
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("functionRunFn can be empty", () => {
    const parser = parse(`function.run add as $user`);
    expect(parser.errors).to.be.empty;
  });
});
