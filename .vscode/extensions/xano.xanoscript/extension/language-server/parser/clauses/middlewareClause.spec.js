import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.middlewareClause();
  return parser;
}

describe("middlewareClause", () => {
  it("middlewareClause accepts empty pre", () => {
    const parser = parse(`middleware = {
      pre: []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts empty post", () => {
    const parser = parse(`middleware = {
      post: []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts both pre and post", () => {
    const parser = parse(`middleware = {
      pre: []
      post: []
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts pre with single middleware object", () => {
    const parser = parse(`middleware = {
      pre: [{
        name: "auth_middleware"
      }]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts post with single middleware object", () => {
    const parser = parse(`middleware = {
      post: [{
        name: "logging_middleware"
      }]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts pre with multiple middleware objects", () => {
    const parser = parse(`middleware = {
      pre: [
        {name: "auth_middleware"}
        {name: "validation_middleware"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts middleware with required attribute", () => {
    const parser = parse(`middleware = {
      pre: [{
        name: "auth_middleware"
        required: true
      }]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts middleware with required set to false", () => {
    const parser = parse(`middleware = {
      pre: [{
        name: "optional_middleware"
        required: false
      }]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts complex configuration with both pre and post", () => {
    const parser = parse(`middleware = {
      pre: [
        {name: "auth_middleware", required: true}
        {name: "rate_limiter", required: false}
      ]
      post: [
        {name: "logging_middleware"}
      ]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts middleware object with only name", () => {
    const parser = parse(`middleware = {
      pre: [{
        name: "auth_middleware"
      }]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause accepts middleware with both attributes using colon syntax", () => {
    const parser = parse(`middleware = {
      pre: [{name: "auth_middleware", required: true}]
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause rejects unknown attributes at top level", () => {
    const parser = parse(`middleware = {
      pre: []
      unknown = true
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("middlewareClause accepts middleware with multiline formatting", () => {
    const parser = parse(`middleware = {
      pre: [
        {
          name: "auth_middleware"
          required: true
        }
        {
          name: "validation_middleware"
          required: false
        }
      ]
      post: [
        {
          name: "logging_middleware"
        }
      ]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("middlewareClause cannot accepts empty middleware block", () => {
    const parser = parse(`middleware = {
    }`);

    expect(parser.errors).to.not.be.empty;
  });
});
