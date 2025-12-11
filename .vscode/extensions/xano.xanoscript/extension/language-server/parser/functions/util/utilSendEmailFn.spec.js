import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilSendEmailFn();
  return parser;
}

describe("utilSendEmailFn", () => {
  it("utilSendEmailFn accepts a xano provider call", () => {
    const parser = parse(`send_email {
      service_provider = "xano"
      subject = "hellow"
      message = "Hey there"
    } as $xano_email`);

    expect(parser.errors).to.be.empty;
    expect(parser.warnings).to.be.empty;
  });

  it("utilSendEmailFn add warnings when unused fields are present", () => {
    const parser = parse(`send_email {
      service_provider = "xano"
      subject = "hellow"
      message = "Hey there"
      cc = ["me@me.com", "john@be.com"]
      from = "admin@xano.com"
    } as $xano_email`);
    expect(parser.warnings).to.not.be.empty;
  });

  it("utilSendEmailFn accepts a resend provider call", () => {
    const parser = parse(`send_email {
      api_key = $env.secret_key
      service_provider = "resend"
      subject = "hellow"
      message = "Hey there"
      to = "some_email@xano.com"
      bcc = []|push:"foo@goo.com"
      cc = ["me@me.com", "john@be.com"]
      from = "admin@xano.com"
      reply_to = "no-reply@xano.com"
      scheduled_at = "2025-11-26T01:01:02.00"
    } as $resend_email`);
    expect(parser.errors).to.be.empty;
  });

  it("utilSendEmailFn rejects missing api key fields for resend provider", () => {
    const parser = parse(`send_email {
      service_provider = "resend"
      to = "some_email@xano.com"
      subject = "hellow"
      message = "Hey there"
    } as $xano_email`);
    expect(parser.errors).to.not.be.empty;
  });
});
