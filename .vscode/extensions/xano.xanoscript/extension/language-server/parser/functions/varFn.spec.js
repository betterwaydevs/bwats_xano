import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.varFn();
  return parser;
}

describe("varFn", () => {
  it("varFn accepts a string literal as value", () => {
    const parser = parse(`var $user {
      value = "email"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn accepts the attribute of a filtered value", () => {
    const parser = parse(`var $user_enabled {
      value = ($user_preferences|first).enabled
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn accepts a filter in the value", () => {
    const parser = parse(`var $transaction_count {
      value = $daily_sales|count
      description = "Count number of transactions"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn accepts a multiline object with commas separated values", () => {
    const parser = parse(`var $rank_order {
      value = {
        "ensign": 1,
        "lieutenant junior grade": 2,
        "lieutenant": 3,
        "lieutenant commander": 4,
        "commander": 5,
        "captain": 6,
        "commodore": 7,
        "rear admiral": 8,
        "vice admiral": 9,
        "admiral": 10
      }
      description = "Defines a numerical order for Starfleet ranks."
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn accepts a description marker", () => {
    const parser = parse(`var $user {
      value = 12.345
      description = "The user's email address"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn requires a value field ", () => {
    const parser = parse(`var $user {
      description = "The user's email address"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("varFn fields can be defined in random order", () => {
    const parser = parse(`var $user {
      description = "The user's email address"
      value = $email
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn accepts a system env variable", () => {
    const parser = parse(`var $user {
      value = $env.$remote_ip
      description = "The user's email address"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("varFn expect a variable name", () => {
    const parser = parse(`var {
      value = "email"
      description = "The user's email address"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("varFn expect an as variable to be an identifier", () => {
    const parser = parse(`var "user" {
      value = "email"
      description = "The user's email address"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("varFn can update a value", () => {
    const parser = parse(`var.update $user.foo {
      value = "email"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should allow accessing a property from an object defined in place", () => {
    let parser = parse(`var $config {
      value = {
        api_key: "12345",
        timeout: 30
      }.api_key
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = {
        api_key: "12345",
        timeout: 30
      }["api_key"]
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = {
        api_key: "12345",
        timeout: 30
      }.["api_key"]
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = {
        api_key: "12345",
        timeout: 30
      }.api-key
      description = "API key from config"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should allow accessing an index from an array defined in place", () => {
    let parser = parse(`var $config {
      value = [1,2,3].0
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = [1,2,3][1]
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = [1,2,3].[1]
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;

    parser = parse(`var $config {
      value = [1,2,3][$index]
      description = "API key from config"
    }`);
    expect(parser.errors).to.be.empty;
  });
});
