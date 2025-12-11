import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.arrayWithValues();
  return parser;
}

describe("arrayWithValues", () => {
  it("arrayWithValues accepts an object as value", () => {
    const parser = parse(`[ { name: "john"} ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts a boolean value", () => {
    const parser = parse(`[ true ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts null value", () => {
    const parser = parse(`[ null ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts multiple values", () => {
    const parser = parse(`[ 1, 2, 3 ]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts compact multiple values", () => {
    const parser = parse(`[1,2,3]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts multiple line object", () => {
    const parser = parse(`[
      1
      2
    ]`);
    expect(parser.errors).to.be.empty;
  });

  // this means we should be using an empty array rule, not arrayWithValues
  it("arrayWithValues does not accepts an empty array", () => {
    const parser = parse(`[]`);
    expect(parser.errors).to.be.empty;
  });

  it("arrayWithValues accepts a mix of values and objects", () => {
    const parser = parse(`[
        {
          name : "client"
          as   : "_client"
          input: {client_id: ""}
          addon: [
            {
              name  : "client"
              as    : "_client"
              offset: "items[]"
              input : {client_id: $output.id}
            }
          ]
        }
      ]`);
    expect(parser.errors).to.be.empty;
  });
});
