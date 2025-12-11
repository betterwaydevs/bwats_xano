import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.apiLambdaFn();
  return parser;
}

describe("apiLambdaFn", () => {
  it("apiLambdaFn accepts data field", () => {
    const parser = parse(`lambda {
      timeout = 10
      code = """
        console.log("hello world");
        """
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("apiLambdaFn can be disabled", () => {
    const parser = parse(`lambda {
      code = """
        console.log("hello world");
        """
      timeout = 10
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("apiLambdaFn can be a single line string", () => {
    const parser = parse(`lambda {
      code = 'console.log("hello world");'
      timeout = 10
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("apiLambdaFn accepts a description", () => {
    const parser = parse(`lambda {
      description = "lambda function"
      code = """
        console.log("hello world");
        """
      timeout = 10
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("apiLambdaFn requires a code field", () => {
    const parser = parse(`lambda {
      description = "lambda new user"
      timeout = 10
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });
});
