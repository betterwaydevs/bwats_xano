import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "../parser/parser.js";
import { FilterMessageProvider } from "./FilterMessageProvider.js";

const testdoc = `
# array_push
does this
# array_pop
does that
# array
does what
to who?
# first
pick the first element
# last
pick the last element
to who?
# concat
Will tape the strings together
# in
checks if value is in array
# !deprecated_filter:array_filter
Some message here
`;

describe("FilterMessageProvider", () => {
  it("should return the message of the function", () => {
    const messageProvider = new FilterMessageProvider(testdoc);
    expect(messageProvider.__filterDoc["array_push"]).to.not.be.undefined;
  });

  it("should parse the functions from the documentation", () => {
    const messageProvider = new FilterMessageProvider(testdoc);

    expect(messageProvider.__filterDoc["array_push"]).to.equal("does this");
    expect(messageProvider.__filterDoc["array"]).to.equal("does what\nto who?");
  });

  it("should display deprecated message on deprecated functions", () => {
    const messageProvider = new FilterMessageProvider(testdoc);
    expect(messageProvider.__filterDoc["deprecated_filter"]).to.equal(
      "`deprecated_filter` is deprecated, use `array_filter` instead."
    );
  });

  it("should match the filter name", async () => {
    const code = `
function foo {
  stack {
    var $value {
      code = "hello"|concat:" world"
    }
    db.query first as $users|first
  }
}`;
    const parser = xanoscriptParser(code.trim());
    const messageProvider = new FilterMessageProvider(testdoc);

    expect(parser.tokVector[15].image).to.equal("concat");
    expect(messageProvider.isMatch(15, parser.tokVector)).to.be.true;

    // this first is not a filter, it's table name
    expect(parser.tokVector[24].image).to.equal("first");
    expect(messageProvider.isMatch(24, parser.tokVector)).to.be.false;

    expect(parser.tokVector[28].image).to.equal("first");
    expect(messageProvider.isMatch(28, parser.tokVector)).to.be.true;
  });

  it("should match even when token is marked as an Identifier as an alternative", async () => {
    const code = `function foo {
  stack {
    var $value {
      code = "hello"|in:["hello", "world"]
    }
  }
}`;
    const parser = xanoscriptParser(code);
    const messageProvider = new FilterMessageProvider(testdoc);

    expect(parser.tokVector[15].image).to.equal("in");
    expect(messageProvider.isMatch(15, parser.tokVector)).to.be.true;
  });
});
