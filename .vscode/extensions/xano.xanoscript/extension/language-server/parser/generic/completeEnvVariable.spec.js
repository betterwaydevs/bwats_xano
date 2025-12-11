import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.completeEnvVariable();
  return parser;
}

describe("completeEnvVariable", () => {
  it("completeEnvVariable accepts environment variable", () => {
    const parser = parse("$env.MY_VARIABLE");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts remote address variable", () => {
    const parser = parse("$env.$remote_ip");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts webflow", () => {
    const parser = parse("$env.$webflow.api_base_url");
    expect(parser.errors).to.be.empty;
  });

  // $env.$remote_passwd
  it("completeEnvVariable accepts remote password variable", () => {
    const parser = parse("$env.$remote_passwd");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts remote port variable", () => {
    const parser = parse("$env.$remote_port");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts remote user variable", () => {
    const parser = parse("$env.$remote_user");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts remote host variable", () => {
    const parser = parse("$env.$remote_host");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts request method variable", () => {
    const parser = parse("$env.$request_method");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts tenant variable", () => {
    const parser = parse("$env.$tenant");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable accepts tenant variable", () => {
    const parser = parse("$env.$http_headers.Referer");
    expect(parser.errors).to.be.empty;
  });

  it("completeEnvVariable warn when using env variable starting with $", () => {
    const parser = parse("$env.$my_custom_variable");
    expect(parser.errors).to.be.empty;
    expect(parser.warnings).not.to.be.empty;
  });

  it("completeEnvVariable rejects property name format", () => {
    let parser = parse('$env.$http_headers["Content-Type"]');
    expect(parser.errors).to.be.empty;
    parser = parse("$env.$http_headers.Content-Type");
    expect(parser.errors).to.not.be.empty;
  });

  it("completeEnvVariable can access env variable using other variable value", () => {
    let parser = parse("$env.$http_headers[$input.header_name]");
    expect(parser.errors).to.be.empty;

    parser = parse("$env.[$input.header_name]");
    expect(parser.errors).to.be.empty;

    parser = parse("$env.[$header_name]");
    expect(parser.errors).to.be.empty;

    parser = parse(`$env.["http_headers"]`);
    expect(parser.errors).to.be.empty;

    parser = parse(`$env["http_headers"]`);
    expect(parser.errors).to.be.empty;
  });
});
