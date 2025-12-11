import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "../parser/parser.js";
import { FunctionMessageProvider } from "./FunctionMessageProvider.js";

const testdoc = `
# api.lambda
does this
# test.lambda
does this
# api.foo.lambda
does that
# lambda
does that
and that
# api
does that
# $var
a variable
`;

describe("FunctionMessageProvider", () => {
  it("should return the message of the function", () => {
    const messageProvider = new FunctionMessageProvider(testdoc);
    expect(messageProvider.__functionDoc["api.lambda"]).to.not.be.undefined;
  });

  it("should define the $var", () => {
    const messageProvider = new FunctionMessageProvider(testdoc);
    expect(messageProvider.__functionDoc["$var"]).to.not.be.undefined;
  });

  it("should parse the functions from the documentation", () => {
    const messageProvider = new FunctionMessageProvider(testdoc);

    expect(messageProvider.__functionDoc["api.lambda"]).to.equal("does this");
    expect(messageProvider.__functionDoc["lambda"]).to.equal(
      "does that\nand that"
    );
  });

  it("should match the function name", async () => {
    const code = `function foo {
  stack {
    api.lambda {
      code = "console.log('hello')"
    }
    foo.lambda {
      code = "console.log('hello')"
    }
    lambda {
      code = "console.log('hello')"
    }
  }
}`;
    const parser = xanoscriptParser(code);
    const messageProvider = new FunctionMessageProvider(testdoc);

    expect(parser.tokVector[9].image).to.equal("lambda");
    expect(messageProvider.isMatch(9, parser.tokVector)).to.be.true;

    expect(parser.tokVector[7].image).to.equal("api");
    expect(messageProvider.isMatch(7, parser.tokVector)).to.be.false;

    expect(parser.tokVector[20].image).to.equal("lambda");
    expect(messageProvider.isMatch(20, parser.tokVector)).to.be.false;

    expect(parser.tokVector[29].image).to.equal("lambda");
    expect(messageProvider.isMatch(29, parser.tokVector)).to.be.true;
  });

  it("should build a search tree", () => {
    const messageProvider = new FunctionMessageProvider(testdoc);
    expect(messageProvider.__searchTree).to.deep.equal({
      lambda: {
        __value: "lambda",
        test: {
          __value: "test.lambda",
        },
        api: {
          __value: "api.lambda",
        },
        foo: {
          api: { __value: "api.foo.lambda" },
        },
      },
      $var: {
        __value: "$var",
      },
      api: {
        __value: "api",
      },
    });
  });

  it("should find the correct match", async () => {
    const code = `function foo {
      stack {
        api.lambda {
          code = "console.log('hello')"
        }
        lambda {
          code = "console.log('hello')"
        }
        api.foo.lambda {
          code = "console.log('hello')"
        }
      }
    }`;
    const parser = xanoscriptParser(code);
    const messageProvider = new FunctionMessageProvider(testdoc);

    expect(parser.tokVector[9].image).to.equal("lambda");
    expect(messageProvider.findFunction(9, parser.tokVector)).to.equal(
      "api.lambda"
    );

    expect(parser.tokVector[18].image).to.equal("lambda");
    expect(messageProvider.findFunction(18, parser.tokVector)).to.equal(
      "lambda"
    );

    expect(parser.tokVector[31].image).to.equal("lambda");
    expect(messageProvider.findFunction(31, parser.tokVector)).to.equal(
      "api.foo.lambda"
    );
  });
});
