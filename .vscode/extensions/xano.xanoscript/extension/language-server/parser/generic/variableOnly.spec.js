import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";
function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.variableOnly();
  return parser;
}

describe("variableOnly", () => {
  it("variableOnly can be a short named variable", () => {
    const parser = parse("$users");
    expect(parser.errors).to.be.empty;
  });

  it("variableOnly can be a variable", () => {
    const parser = parse("$var.users");
    expect(parser.errors).to.be.empty;
  });

  it("variableOnly can be a short named variable with sub props", () => {
    const parser = parse("$users.x.y[1].z");
    expect(parser.errors).to.be.empty;
  });

  it("variableOnly can be a variable with sub props", () => {
    const parser = parse("$var.users.x.y[1].z");
    expect(parser.errors).to.be.empty;
  });

  it("variableOnly cannot be an env variable", () => {
    const parser = parse("$env.my_api_key");
    expect(parser.errors).to.not.be.empty;
  });

  it("variableOnly cannot be an input variable", () => {
    const parser = parse("$input.remote_ip");
    expect(parser.errors).to.not.be.empty;
  });

  it("variableOnly cannot be a string", () => {
    const parser = parse(`"someting"`);
    expect(parser.errors).to.not.be.empty;
  });
});
