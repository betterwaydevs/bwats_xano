import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.webflowRequestFn();
  return parser;
}

describe("webflowRequestFn", () => {
  it("webflowRequestFn accepts url and method field", () => {
    const parser = parse(`request {
      path = "https://www.example.com"
      method = "GET"
    } as $script`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn can be disabled", () => {
    const parser = parse(`request {
      path = "https://www.example.com"
      method = "GET"
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn can be disabled", () => {
    const parser = parse(`request {
      path = "https://www.example.com"
      method = $input.method
      disabled = true
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn accepts a description", () => {
    const parser = parse(`request {
      description = "request function"
      path = "https://www.example.com"
      method = "GET"
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn accepts a lot of fields", () => {
    const parser = parse(`request {
      path = "https://www.example.com"
      method = "POST"
      params = {}|set:"foo":"bar"
      headers = []|push:"Set-Cookie: sessionId=e8bb43229de9; Domain=foo.example.com"
      timeout = 25
      ca_certificate = "what is this"
      certificate = """
        -----BEGIN CERTIFICATE-----
        MIIDwDCCAqigAwIBAgIUKdx0jsUKOA0rPL/+cDSX9Jf/lBcwDQYJKoZIhvcNAQEL
        BQAwcDELMAkGA1UEBhMCR0IxEjAQBgNVBAgMCVdpbHRzaGlyZTESMBAGA1UEBwwJ
        U2FsaXNidXJ5MRUwEwYDVQQKDAxQYWhvIFByb2plY3QxEDAOBgNVBAsMB1Rlc3Rp
        bmcxEDAOBgNVBAMMB1Jvb3QgQ0EwIBcNMjMwNDEzMTMyMjMxWhgPMjEwNTA2MDIx
        MzIyMzFaMHAxCzAJBgNVBAYTAkdCMRIwEAYDVQQIDAlXaWx0c2hpcmUxEjAQBgNV
        BAcMCVNhbGlzYnVyeTEVMBMGA1UECgwMUGFobyBQcm9qZWN0MRAwDgYDVQQLDAdU
        tcYhJg==
        -----END CERTIFICATE-----
        """
      certificate_pass = "my awesome password"
      private_key = "knlkn3f3n"
      follow_location = false
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn requires a path and method field", () => {
    let parser = parse(`request {
      path = "https://www.example.com"
    } as $user`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`request {
      method = "GET"
    } as $user`);
    expect(parser.errors).to.not.be.empty;
  });

  it("webflowRequestFn accepts host criteria", () => {
    const parser = parse(`request {
      description = "Agent Request endpoint"
      path = "https://xvrs-fsxb-w8c7.n7c.xano.io/api:cboqAX1t/hello_world"
      method = "POST"
      params = {}|set:"message":$clean_text|set:"history":($thread_replies.messages|json_encode)|set:"key":"2183eyn1#!@DA!#!@RFJ#@*!@DJ!"
      headers = []|push:"Content-Type: application/json"
      timeout = 100
      verify_host = false
      verify_peer = false
      mock = {
        test_1: { "status": "success", "response": {"reply": "This is a mocked response for test_1"} }
        test_2: { "status": "success", "response": {"reply": "This is a mocked response for test_2"} }
      }
    } as $ai_response`);
    expect(parser.errors).to.be.empty;
  });

  it("webflowRequestFn accepts follow_location to false", () => {
    const parser = parse(`request {
      path = "https://www.example.com"
      method = "GET"
      follow_location = false
    } as $new_user`);
    expect(parser.errors).to.be.empty;
  });
});
