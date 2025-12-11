import { expect } from "chai";
import { describe, it } from "mocha";
import { CommentToken, CommentTokens } from "./comment.js";
import { lexDocument } from "./lexer.js";

describe("Comment Lexer", () => {
  describe("CommentToken", () => {
    it("should match a simple comment", () => {
      const input = "// This is a comment";
      const result = lexDocument(input);

      expect(result.errors).to.be.empty;
      expect(result.tokens).to.have.length(1);
      expect(result.tokens[0].tokenType).to.equal(CommentToken);
      expect(result.tokens[0].image).to.equal("// This is a comment");
    });

    it("should match comment with special characters", () => {
      const input = "// TODO: Fix this bug @user123!";
      const result = lexDocument(input);

      expect(result.errors).to.be.empty;
      expect(result.tokens).to.have.length(1);
      expect(result.tokens[0].tokenType).to.equal(CommentToken);
      expect(result.tokens[0].image).to.equal(
        "// TODO: Fix this bug @user123!"
      );
    });

    it("should match empty comment", () => {
      const input = "//";
      const result = lexDocument(input);

      expect(result.errors).to.be.empty;
      expect(result.tokens).to.have.length(1);
      expect(result.tokens[0].tokenType).to.equal(CommentToken);
      expect(result.tokens[0].image).to.equal("//");
    });

    it("should NOT match // in the middle of a line", () => {
      const input = "some code // comment";
      const result = lexDocument(input);

      // Comments are only allowed on their own line (with optional leading whitespace)
      // So // in the middle of a line should be tokenized as division operators
      expect(result.errors).to.be.empty;
      const commentTokens = result.tokens.filter(
        (token) => token.tokenType === CommentToken
      );
      expect(commentTokens).to.have.length(0); // No comment token should be found
    });

    it("should handle multiple lines with comments", () => {
      const input = `// First comment
   // Second comment
some code
      // Third comment`;
      const result = lexDocument(input);

      expect(result.errors).to.be.empty;
      const commentTokens = result.tokens.filter(
        (token) => token.tokenType === CommentToken
      );
      expect(commentTokens).to.have.length(3);
      expect(commentTokens[0].image).to.equal("// First comment");
      expect(commentTokens[1].image).to.equal("// Second comment");
      expect(commentTokens[2].image).to.equal("// Third comment");
    });
  });

  describe("CommentTokens export", () => {
    it("should export CommentTokens array", () => {
      expect(CommentTokens).to.be.an("array");
      expect(CommentTokens).to.include(CommentToken);
    });
  });
});
