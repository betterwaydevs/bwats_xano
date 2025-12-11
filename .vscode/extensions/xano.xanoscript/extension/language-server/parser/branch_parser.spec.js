import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("branch_parser", () => {
  it("should parse a complete branch with identifier", () => {
    const parser = xanoscriptParser(`// This is the original branch.
  branch v1 {
    color = "#fff3cd"
    middleware = {
      function: {pre: [{name: "test middleware 2"}], post: []}
      query   : {
        pre : [{name: "test middleware 1"}]
        post: [{name: "test middleware 2"}]
      }
      task    : {
        pre : [{name: "test middleware 2"}]
        post: [{name: "test middleware 1"}]
      }
      tool    : {pre: [], post: [{name: "test middleware 2"}]}
    }
  
    history = {
      function  : false
      query     : 100
      task      : 100
      tool      : 100
      trigger   : false
      middleware: false
    }
  }`);
    expect(parser.errors).to.be.empty;
  });
});
