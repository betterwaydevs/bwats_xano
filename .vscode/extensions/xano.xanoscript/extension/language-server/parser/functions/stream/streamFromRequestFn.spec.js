import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.streamFromRequestFn();
  return parser;
}

describe("stream.from_request", () => {
  it("works with minimal parameters", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("works with all params", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
      verify_host = false
      verify_peer = false
      ca_certificate = ""
      certificate = ""
      certificate_pass = ""
      private_key = ""
      private_key_pass = ""
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("has duplicate attributes", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      url = "https://google.com.site/"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("rejects illegal attributes", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
      illegalAttr = "value"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.not.be.empty;
  });

  it("can be disabled", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
      disabled = true
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });

  it("accepts a description", () => {
    const input = `from_request {
      url = "https://webhook.site/8aa94772-0457-4b62-803d-69b63d2664d1"
      method = "GET"
      params = {}|set:"my_var":"my_value"
      headers = []
      timeout = 10
      follow_location = true
      description = "foo"
    } as $stream_1`;
    const parser = parse(input);
    expect(parser.errors).to.be.empty;
  });
});
