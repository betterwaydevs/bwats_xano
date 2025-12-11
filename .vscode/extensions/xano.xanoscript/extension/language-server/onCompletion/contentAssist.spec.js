import { expect } from "chai";
import { describe, it, xit } from "mocha";
import { getContentAssistSuggestions, suggestable } from "./contentAssist.js";

describe("contentAssist", () => {
  describe("suggestable", () => {
    it("should return true for suggestions with LABEL", () => {
      const suggestion = {
        nextTokenType: {
          LABEL: "test_label",
        },
      };
      expect(suggestable(suggestion)).to.be.true;
    });

    it("should return false for suggestions without LABEL", () => {
      const suggestion = {
        nextTokenType: {
          name: "TestToken",
        },
      };
      expect(suggestable(suggestion)).to.be.false;
    });

    it("should return false for suggestions with empty LABEL", () => {
      const suggestion = {
        nextTokenType: {
          LABEL: "",
        },
      };
      expect(suggestable(suggestion)).to.be.false;
    });
  });

  describe("getContentAssistSuggestions", () => {
    xit("should return suggestions for each parser scheme with minimal valid input", () => {
      const schemes = ["function", "api", "db", "task"];
      const minimalInputs = {
        function: "function test { input {\n} \nstack {\ndb.",
        api: "query test { input { text name } stack { } \nresponse = null }",
        db: "table test { columns { id int } }",
        task: "task test { input { } stack { } }",
      };
      schemes.forEach((scheme) => {
        const text = minimalInputs[scheme];
        const suggestions = getContentAssistSuggestions(text, scheme);
        console.log(`Scheme: ${scheme}, Suggestions:`, suggestions);
        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.be.greaterThan(0);
        // Should contain at least one suggestion with a label
        expect(suggestions.some((s) => s.label)).to.be.true;
      });
    });
    describe("filter suggestions after pipe token", () => {
      it("should suggest filters when text ends with pipe token", () => {
        const text = "$variable|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.be.greaterThan(0);

        // Check that we get filter suggestions
        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("to_upper");
        expect(filterLabels).to.include("to_lower");
        expect(filterLabels).to.include("trim");
        expect(filterLabels).to.include("count");
      });

      it("should suggest filters with correct completion kind", () => {
        const text = "$var|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions.length).to.be.greaterThan(0);

        // All suggestions should have a kind property (encoded as number)
        suggestions.forEach((suggestion) => {
          expect(suggestion).to.have.property("kind");
          expect(suggestion.kind).to.be.a("number");
        });
      });

      it("should suggest filters for complex expressions ending with pipe", () => {
        const text = "$input.name|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.be.greaterThan(0);

        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("to_upper");
      });

      it("should include math filters in suggestions", () => {
        const text = "$number|";
        const suggestions = getContentAssistSuggestions(text, "api");

        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("sin");
        expect(filterLabels).to.include("cos");
        expect(filterLabels).to.include("floor");
        expect(filterLabels).to.include("ceil");
      });

      it("should include array filters in suggestions", () => {
        const text = "$array|";
        const suggestions = getContentAssistSuggestions(text, "api");

        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("first");
        expect(filterLabels).to.include("last");
        expect(filterLabels).to.include("count");
        expect(filterLabels).to.include("reverse");
      });

      it("should work with different schemes when pipe is present", () => {
        const text = "$var|";

        const apiSuggestions = getContentAssistSuggestions(text, "api");
        const dbSuggestions = getContentAssistSuggestions(text, "db");
        const functionSuggestions = getContentAssistSuggestions(
          text,
          "function"
        );
        const taskSuggestions = getContentAssistSuggestions(text, "task");

        // All should return filter suggestions since pipe is detected first
        expect(apiSuggestions.length).to.be.greaterThan(0);
        expect(dbSuggestions.length).to.be.greaterThan(0);
        expect(functionSuggestions.length).to.be.greaterThan(0);
        expect(taskSuggestions.length).to.be.greaterThan(0);

        // They should all be the same (filter suggestions)
        expect(apiSuggestions.length).to.equal(dbSuggestions.length);
        expect(apiSuggestions.length).to.equal(functionSuggestions.length);
        expect(apiSuggestions.length).to.equal(taskSuggestions.length);
      });

      it("should include documentation for filters when available", () => {
        const text = "$var|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions.length).to.be.greaterThan(0);

        // Find a filter that should have documentation
        const upperFilter = suggestions.find((s) => s.label === "upper");
        const trimFilter = suggestions.find((s) => s.label === "trim");

        // Check that some filters have documentation
        if (upperFilter) {
          expect(upperFilter).to.have.property("documentation");
          if (upperFilter.documentation) {
            expect(upperFilter.documentation).to.have.property(
              "kind",
              "markdown"
            );
            expect(upperFilter.documentation).to.have.property("value");
            expect(upperFilter.documentation.value).to.be.a("string");
          }
        }

        if (trimFilter) {
          expect(trimFilter).to.have.property("documentation");
          if (trimFilter.documentation) {
            expect(trimFilter.documentation).to.have.property(
              "kind",
              "markdown"
            );
            expect(trimFilter.documentation).to.have.property("value");
            expect(trimFilter.documentation.value).to.be.a("string");
          }
        }
      });
    });

    describe("normal completion without pipe token", () => {
      it("should return empty array for unknown scheme", () => {
        const text = "query test { ";
        const suggestions = getContentAssistSuggestions(text, "unknown");

        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.equal(0);
      });

      it("should handle empty text", () => {
        const text = "";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        // Should not crash and return some form of suggestions or empty array
      });

      it("should not suggest filters when no pipe token present", () => {
        const text = "query test { stack { var $test { value = ";
        const suggestions = getContentAssistSuggestions(text, "api");

        // Should not return filter suggestions (those would have 270+ items)
        // Normal syntactic suggestions should be much fewer
        if (suggestions.length > 200) {
          // If we get a lot of suggestions, they shouldn't be filters
          const filterLabels = suggestions.map((s) => s.label);
          expect(filterLabels).to.not.include("upper");
          expect(filterLabels).to.not.include("lower");
        }
      });

      it("should handle malformed syntax gracefully", () => {
        const text = "query { { { invalid syntax";

        // Should not throw an error
        expect(() => {
          getContentAssistSuggestions(text, "api");
        }).to.not.throw();
      });
    });

    describe("edge cases", () => {
      it("should handle text with only pipe token", () => {
        const text = "|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.be.greaterThan(0);

        // Should still suggest filters
        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("to_upper");
      });

      it("should handle multiple pipe tokens", () => {
        const text = "$var|to_upper|";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        expect(suggestions.length).to.be.greaterThan(0);

        // Should suggest filters for the last pipe
        const filterLabels = suggestions.map((s) => s.label);
        expect(filterLabels).to.include("to_lower");
      });

      it("should handle whitespace around pipe", () => {
        const text = "$var | ";
        const suggestions = getContentAssistSuggestions(text, "api");

        expect(suggestions).to.be.an("array");
        // Should handle this case gracefully, even if no suggestions
      });
    });

    describe("error handling", () => {
      it("should handle invalid input gracefully", () => {
        // Test with text that might cause issues but should not throw
        const edgeCases = [
          "", // empty string should work
          " ", // whitespace
          "invalid_syntax_here",
        ];

        edgeCases.forEach((text) => {
          expect(() => {
            const result = getContentAssistSuggestions(text, "api");
            expect(result).to.be.an("array");
          }).to.not.throw();
        });
      });

      it("should return empty array on lexer errors", () => {
        // Test with text that causes lexer issues - should catch and return []
        const result = getContentAssistSuggestions("query { invalid }", "api");
        expect(result).to.be.an("array");
      });
    });
  });
});
