import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.cacheClause();
  return parser;
}

describe("cacheClause", () => {
  it("cacheClause defines the cache", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : true
      auth      : true
      datasource: true
      ip        : false
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("cacheClause headers and env are optionals", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : true
      auth      : true
      datasource: true
      ip        : false
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("cacheClause ttl should be int", () => {
    const parser = parse(`cache = {
      ttl       : "foo"
      input     : true
      auth      : true
      datasource: true
      ip        : false
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("cacheClause input should be boolean", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : "foo"
      auth      : true
      datasource: true
      ip        : false
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("cacheClause auth should be boolean", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : true
      auth      : "foo"
      datasource: true
      ip        : false
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("cacheClause datasource should be boolean", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : true
      auth      : true
      datasource: "foo"
      ip        : false
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("cacheClause ip should be boolean", () => {
    const parser = parse(`cache = {
      ttl       : 3600
      input     : true
      auth      : true
      datasource: true
      ip        : "foo"
      headers   : ["foo=bar"]
      env       : ["some_var"]
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
