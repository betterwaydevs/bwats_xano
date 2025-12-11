import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.storageSignPrivateUrlFn();
  return parser;
}

describe("storage.sign_private_url", () => {
  it("Check sign_private_url is accepts a pathname and a ttl", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
    } as $signed_url`);
    expect(parser.errors).to.be.empty;
  });

  it("sign_private_url requires a ttl", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
    } as $signed_url`);
    expect(parser.errors).to.not.be.empty;
  });

  it("sign_private_url requires a pathname", () => {
    const parser = parse(`sign_private_url {
      ttl = 30
    } as $signed_url`);
    expect(parser.errors).to.not.be.empty;
  });

  it("sign_private_url rejects duplicate attributes", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
      ttl = 15
    } as $signed_url`);
    expect(parser.errors).to.not.be.empty;
  });

  it("sign_private_url rejects illegal attributes", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
      illegalAttr = "value"
    } as $signed_url`);
    expect(parser.errors).to.not.be.empty;
  });

  it("sign_private_url accepts description attribute", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
      description = "A description"
    } as $signed_url`);
    expect(parser.errors).to.be.empty;
  });

  it("sign_private_url accepts disabled attribute", () => {
    const parser = parse(`sign_private_url {
      pathname = "foo_bar.txt"
      ttl = 30
      disabled = true
    } as $signed_url`);
    expect(parser.errors).to.be.empty;
  });
});
