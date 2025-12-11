import { expect } from "chai";
import { beforeEach,describe, it } from "mocha";
import {
  __resetTokens,
  createTokenByName,
  createUniqToken,
  sortUniqTokens,
} from "./utils.js";

describe("createUniqToken", () => {
  beforeEach(() => {
    __resetTokens();
  });

  it("creates a token with a unique pattern", () => {
    const token1 = createUniqToken({ pattern: /foo/ });
    const token2 = createUniqToken({ pattern: /foo/ });
    expect(token1).to.equal(token2);
  });
});

describe("createTokenByName", () => {
  beforeEach(() => {
    __resetTokens();
  });

  it("creates a token with a name derived from the given name", () => {
    const token = createTokenByName("foo");
    expect(token.name).to.equal("foo token");
    expect(token.LABEL).to.equal("foo");
    expect(new RegExp(token.pattern).test("foo")).to.be.true;
  });

  it("creates a token with a name derived from the given name", () => {
    const token = createTokenByName("$remote_ip", { pattern: /\$remote_ip/ });
    expect(token.name).to.equal("$remote_ip token");
    expect(token.LABEL).to.equal("$remote_ip");
  });

  it("does not create duplicate tokens", () => {
    const token1 = createTokenByName("foo");
    const token2 = createTokenByName("foo");
    expect(token1).to.equal(token2);
  });

  it("differentiate between lowercase and uppercase", () => {
    const token_get = createTokenByName("get");
    const token_GET = createTokenByName("GET");
    expect(token_get.name).to.not.equal(token_GET.name);
  });
});

describe("sortUniqTokens", () => {
  it("sorts tokens by pattern length", () => {
    const token1 = createUniqToken({ pattern: /foo/ });
    const token2 = createUniqToken({ pattern: /fooBar/ });
    const token3 = createUniqToken({ pattern: /fooBarBaz/ });
    const tokens = sortUniqTokens([token1, token2, token3]);
    expect(tokens).to.deep.equal([token3, token2, token1]);
  });
});
