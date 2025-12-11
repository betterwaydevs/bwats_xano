import { expect } from "chai";
import { Lexer } from "chevrotain";
import { describe, it } from "mocha";
import { MultiLineExpressionToken, MultiLineStringToken } from "./multiline.js";

describe("MultiLineStringToken", () => {
  const lexer = new Lexer([MultiLineStringToken, MultiLineExpressionToken]);

  it("should match a valid multiline string with content LF", () => {
    const input = '"""\nThis is a multiline string.\n   """';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a valid multiline string with content CRLF", () => {
    const input = '"""\r\nThis is a multiline string.\r\n   """';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a valid multiline expression with content", () => {
    const input = '```\n{"x": "test"}\n   ```';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineExpressionToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a valid multiline string with content (single quote)", () => {
    const input = "'''\nThis is a multiline string.\n   '''";
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a valid empty multiline string", () => {
    const input = '"""\n"""';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });
  it("should match a valid empty multiline string (single quotes)", () => {
    const input = "'''\n'''";
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a valid empty multiline expression", () => {
    const input = "```\n```";
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineExpressionToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a multiline string with a single string quote sentence inside", () => {
    const input = '"""\nconsole.log("quoted"); // sentence.\n"""';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should match a multiline string followed by other content", () => {
    const input = '"""\nContent here\n """\nnextToken';
    const result = lexer.tokenize(input);
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: '"""\nContent here\n """',
      startOffset: 0,
    });
    // Errors for '\nnextToken' are expected
  });

  it("should reject a multiline string with no newline after opening quotes", () => {
    const input = '""" Content\n"""';
    const result = lexer.tokenize(input);
    expect(result.tokens).to.be.empty;
    expect(result.errors).to.not.be.empty;
  });

  it("should reject a multiline string with non-space characters before closing quotes", () => {
    const input = '"""\nContent\nfoo """';
    const result = lexer.tokenize(input);
    expect(result.tokens).to.be.empty;
    expect(result.errors).to.not.be.empty;
  });

  it("should reject a multiline string with tabs before closing quotes", () => {
    const input = '"""\nContent\n\t"""';
    const result = lexer.tokenize(input);
    expect(result.tokens).to.be.empty;
    expect(result.errors).to.not.be.empty;
  });

  it("should reject a multiline expression with tabs before closing quotes", () => {
    const input = "```\nContent\n\t```";
    const result = lexer.tokenize(input);
    expect(result.tokens).to.be.empty;
    expect(result.errors).to.not.be.empty;
  });

  it("should handle internal opposite quotes correctly (double quotes)", () => {
    const input = '"""\nThis has \'\'\' inside\n """';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should handle internal opposite quotes correctly (single quotes)", () => {
    const input = "'''\nThis has \"\"\" inside\n '''";
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });

  it("should handle internal triple quotes correctly", () => {
    const input = '"""\nThis has """ inside\n """';
    const result = lexer.tokenize(input);
    expect(result.errors).to.be.empty;
    expect(result.tokens).to.have.lengthOf(1);
    expect(result.tokens[0]).to.include({
      tokenType: MultiLineStringToken,
      image: input,
      startOffset: 0,
    });
  });
});
