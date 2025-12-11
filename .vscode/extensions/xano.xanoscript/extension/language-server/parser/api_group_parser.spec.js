import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("api_group", () => {
  it("should parse a basic api_group", () => {
    const parser = xanoscriptParser(`api_group foo {
  canonical = "foo"
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a rich api_group", () => {
    const parser = xanoscriptParser(`api_group "some name" {
  description = "Some description"
  active = false
  canonical = "HZ4jLtdc"
  tags = ["foo", "bar"]
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should accept a request history statement", () => {
    const parser = xanoscriptParser(`api_group Reservations {
  canonical = "kNryk0Kj"
  history = "inherit"
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a protected swagger api_group", () => {
    const parser = xanoscriptParser(`api_group "some name" {
  description = "Some description"
  active = false
  canonical = "HZ4jLtdc"
  tags = ["foo", "bar"]
  swagger = {token: "something"}
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a disable swagger api_group", () => {
    const parser = xanoscriptParser(`api_group Authentication {
  active = false
  canonical = "9kxfIBpH"
  swagger = {active: false}
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should reject an api_group without a name", () => {
    const parser = xanoscriptParser(`api_group {
  canonical = "HZ4jLtdc"
}`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should accepts an empty api_group without a canonical", () => {
    const parser = xanoscriptParser(`api_group my_api_group {
  description = "Some description"
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse an api_group with cors block", () => {
    const parser = xanoscriptParser(`api_group my_api {
  canonical = "abc123"
  cors = {
    mode: "custom",
    origins: ["https://example.com", "https://app.example.com"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    headers: ["Content-Type", "Authorization"],
    credentials: true,
    max_age: 3600
  }
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse an api_group with minimal cors block", () => {
    const parser = xanoscriptParser(`api_group my_api {
  canonical = "def456"
  cors = {}
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse an api_group with partial cors configuration", () => {
    const parser = xanoscriptParser(`api_group my_api {
  canonical = "ghi789"
  cors = {
    mode: "simple",
    origins: ["*"]
  }
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse an api_group with cors credentials only", () => {
    const parser = xanoscriptParser(`api_group my_api {
  canonical = "jkl012"
  cors = {
    credentials: false
  }
}`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a complete api_group with cors and other fields", () => {
    const parser = xanoscriptParser(`api_group "User Management" {
  description = "Handles user operations"
  active = true
  canonical = "mno345"
  tags = ["users", "auth"]
  cors = {
    mode: "custom",
    origins: ["https://frontend.example.com"],
    methods: ["GET", "POST"],
    headers: ["X-Custom-Header"],
    credentials: true,
    max_age: 7200
  }
  swagger = {active: true, token: "secret123"}
}`);
    expect(parser.errors).to.be.empty;
  });
});
