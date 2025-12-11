import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { InputFilterMessageProvider } from "./InputFilterMessageProvider.js";

const testInputFiltersMd = `
# trim
Removes excess whitespace from the beginning and end of the entry.

# min
Enforces a minimum value or length for the entry.

# max
Enforces a maximum value or length for the entry.

# lower
Converts all characters to lowercase.

# upper
Converts all characters to uppercase.
`;

describe("InputFilterMessageProvider", () => {
  let provider;

  beforeEach(() => {
    provider = new InputFilterMessageProvider(testInputFiltersMd);
  });

  describe("parseFilters", () => {
    it("should parse filter documentation correctly", () => {
      expect(provider.__filterDoc["trim"]).to.equal(
        "Removes excess whitespace from the beginning and end of the entry."
      );
      expect(provider.__filterDoc["min"]).to.equal(
        "Enforces a minimum value or length for the entry."
      );
      expect(provider.__filterDoc["max"]).to.equal(
        "Enforces a maximum value or length for the entry."
      );
      expect(provider.__filterDoc["lower"]).to.equal(
        "Converts all characters to lowercase."
      );
    });

    it("should have all expected filters", () => {
      const filterNames = Object.keys(provider.__filterDoc);
      expect(filterNames).to.include.members([
        "trim",
        "min",
        "max",
        "lower",
        "upper",
      ]);
    });
  });

  describe("findFilter", () => {
    it("should find existing filters", () => {
      const mockTokens = [{ tokenType: { name: "Identifier" }, image: "trim" }];

      const result = provider.findFilter(0, mockTokens);
      expect(result).to.equal("trim");
    });

    it("should return null for non-existent filters", () => {
      const mockTokens = [
        { tokenType: { name: "Identifier" }, image: "nonexistent" },
      ];

      const result = provider.findFilter(0, mockTokens);
      expect(result).to.be.null;
    });

    it("should return null for non-identifier tokens", () => {
      const mockTokens = [
        { tokenType: { name: "StringLiteral" }, image: "trim" },
      ];

      const result = provider.findFilter(0, mockTokens);
      expect(result).to.be.null;
    });
  });

  describe("isMatch", () => {
    it("should return false for index 0", () => {
      const tokens = [{ image: "trim" }];
      expect(provider.isMatch(0, tokens)).to.be.false;
    });

    it("should return false when not after = or |", () => {
      const tokens = [{ image: "something" }, { image: "trim" }];
      expect(provider.isMatch(1, tokens)).to.be.false;
    });

    it("should return true for filter after filters=", () => {
      const tokens = [
        { image: "filters" },
        { image: "=" },
        { tokenType: { name: "Identifier" }, image: "trim" },
      ];
      expect(provider.isMatch(2, tokens)).to.be.true;
    });

    it("should return true for filter after pipe in filters context", () => {
      const tokens = [
        { image: "filters" },
        { image: "=" },
        { tokenType: { name: "Identifier" }, image: "trim" },
        { image: "|" },
        { tokenType: { name: "Identifier" }, image: "upper" },
      ];
      expect(provider.isMatch(4, tokens)).to.be.true;
    });

    it("should return false for filter after = without filters", () => {
      const tokens = [
        { image: "value" },
        { image: "=" },
        { tokenType: { name: "Identifier" }, image: "trim" },
      ];
      expect(provider.isMatch(2, tokens)).to.be.false;
    });

    it("should return false for unknown filter", () => {
      const tokens = [
        { image: "filters" },
        { image: "=" },
        { tokenType: { name: "Identifier" }, image: "unknown_filter" },
      ];
      expect(provider.isMatch(2, tokens)).to.be.false;
    });

    it("should stop searching at boundary tokens", () => {
      const tokens = [
        { image: "filters" },
        { image: "=" },
        { image: "something" },
        { image: "{" },
        { image: "other" },
        { image: "=" },
        { tokenType: { name: "Identifier" }, image: "trim" },
      ];
      expect(provider.isMatch(6, tokens)).to.be.false;
    });

    it("should handle complex filter chain", () => {
      const tokens = [
        { image: "text" },
        { image: "name" },
        { image: "filters" },
        { image: "=" },
        {
          tokenType: { name: "trim token", LONGER_ALT: { name: "Identifier" } },
          image: "trim",
        },
        { image: "|" },
        { tokenType: { name: "Identifier" }, image: "upper" },
        { image: "|" },
        { tokenType: { name: "Identifier" }, image: "lower" },
      ];
      expect(provider.isMatch(4, tokens)).to.be.true; // trim
      expect(provider.isMatch(6, tokens)).to.be.true; // upper
      expect(provider.isMatch(8, tokens)).to.be.true; // lower
    });
  });

  describe("render", () => {
    it("should return filter documentation when filter exists", () => {
      const mockTokens = [{ tokenType: { name: "Identifier" }, image: "trim" }];

      const result = provider.render(0, mockTokens);
      expect(result).to.equal(
        "Removes excess whitespace from the beginning and end of the entry."
      );
    });

    it("should return undefined when filter doesn't exist", () => {
      const mockTokens = [
        { tokenType: { name: "Identifier" }, image: "nonexistent" },
      ];

      const result = provider.render(0, mockTokens);
      expect(result).to.be.undefined;
    });
  });

  describe("integration with real parser", () => {
    it("should work with actual XanoScript parsing", async () => {
      // Import the actual parser functions
      const { lexDocument } = await import("../lexer/lexer.js");
      const { xanoscriptParser } = await import("../parser/parser.js");
      const { getSchemeFromContent } = await import("../utils.js");

      const code = `table users {
  text name filters=trim
  email address filters=lower|trim
}`;

      // Get the proper scheme
      const scheme = getSchemeFromContent(code);
      // console.log("Detected scheme:", scheme);

      // Tokenize the document
      const lexResult = lexDocument(code);
      expect(lexResult.errors).to.have.length(0);

      // Parse the XanoScript with the correct scheme
      const parser = xanoscriptParser(code, scheme);
      const tokens = lexResult.tokens;

      // Find the token for "trim" after filters=
      let trimTokenIndex = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (
          tokens[i].image === "trim" &&
          i > 0 &&
          tokens[i - 1].image === "="
        ) {
          trimTokenIndex = i;
          break;
        }
      }

      expect(trimTokenIndex).to.be.greaterThan(-1);

      // Test that the provider matches
      // console.log("Parser sectionStack:", parser.sectionStack);
      // console.log(
      //   "Token at index",
      //   trimTokenIndex,
      //   ":",
      //   tokens[trimTokenIndex]
      // );
      // console.log("Previous token:", tokens[trimTokenIndex - 1]);

      const matches = provider.isMatch(trimTokenIndex, tokens, parser);
      // console.log("Provider matches:", matches);

      expect(matches).to.be.true;

      // Test that it renders the correct documentation
      const result = provider.render(trimTokenIndex, tokens, parser);
      expect(result).to.equal(
        "Removes excess whitespace from the beginning and end of the entry."
      );
    });

    it("should NOT match filters in pipe expressions", async () => {
      // Import the actual parser functions
      const { lexDocument } = await import("../lexer/lexer.js");
      const { xanoscriptParser } = await import("../parser/parser.js");

      const code = `query test verb=GET {
  stack {
    var $result { value = $input.name|trim }
  }
}`;

      // Tokenize the document
      const lexResult = lexDocument(code);
      expect(lexResult.errors).to.have.length(0);

      // Parse the XanoScript to ensure no syntax errors
      xanoscriptParser("query", code);
      const tokens = lexResult.tokens;

      // Find the token for "trim" after |
      let trimTokenIndex = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (
          tokens[i].image === "trim" &&
          i > 0 &&
          tokens[i - 1].image === "|"
        ) {
          trimTokenIndex = i;
          break;
        }
      }

      expect(trimTokenIndex).to.be.greaterThan(-1);

      // Test that the InputFilterMessageProvider does NOT match pipe expressions without filters= context
      const matches = provider.isMatch(trimTokenIndex, tokens);
      expect(matches).to.be.false;
    });

    it("should work with actual XanoScript parsing for input filters", async () => {
      // Import the actual parser functions
      const { lexDocument } = await import("../lexer/lexer.js");
      const { xanoscriptParser } = await import("../parser/parser.js");

      const code = `table users {
  text name filters=trim|upper
}`;

      // Tokenize the document
      const lexResult = lexDocument(code);
      expect(lexResult.errors).to.have.length(0);

      // Parse the XanoScript to ensure no syntax errors
      xanoscriptParser("table", code);
      const tokens = lexResult.tokens;

      // Find the token for "trim" after filters=
      let trimTokenIndex = -1;
      for (let i = 0; i < tokens.length; i++) {
        if (
          tokens[i].image === "trim" &&
          i > 0 &&
          tokens[i - 1].image === "="
        ) {
          trimTokenIndex = i;
          break;
        }
      }

      expect(trimTokenIndex).to.be.greaterThan(-1);

      // Test that the InputFilterMessageProvider matches input filters
      const matches = provider.isMatch(trimTokenIndex, tokens);
      expect(matches).to.be.true;

      // Test the render method
      const result = provider.render(trimTokenIndex, tokens);
      expect(result).to.not.be.undefined;
      expect(result).to.include("whitespace");
    });
  });
});
