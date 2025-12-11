import { expect } from "chai";
import { beforeEach, describe, it } from "mocha";
import { lexDocument } from "../lexer/lexer.js";
import { QueryFilterMessageProvider } from "./queryFilterMessageProvider.js";

const testQueryFiltersMd = `
# inner_product
Provides the inner product between two vectors.

\`\`\`xs
db.embedding.vector|inner_product:$input.query_vector
\`\`\`

Calculates the dot product between two numeric arrays.

# cosine_distance
Provides the cosine distance between two vectors.

\`\`\`xs
db.embedding.vector|cosine_distance:$input.query_vector
\`\`\`

Calculates the cosine distance (1 - cosine similarity) between two numeric arrays.

# distance
Provides the distance in meters between two geometries.

\`\`\`xs
db.location.geometry|distance:$input.target_geometry
\`\`\`

Returns the distance between two geometric objects in meters.
`;

describe("QueryFilterMessageProvider", () => {
  let provider;

  beforeEach(() => {
    provider = new QueryFilterMessageProvider(testQueryFiltersMd);
  });

  describe("parseFilters", () => {
    it("should parse filter documentation correctly", () => {
      expect(provider.__filterDoc["inner_product"]).to.equal(
        "Provides the inner product between two vectors.\n\n```xs\ndb.embedding.vector|inner_product:$input.query_vector\n```\n\nCalculates the dot product between two numeric arrays."
      );
      expect(provider.__filterDoc["cosine_distance"]).to.equal(
        "Provides the cosine distance between two vectors.\n\n```xs\ndb.embedding.vector|cosine_distance:$input.query_vector\n```\n\nCalculates the cosine distance (1 - cosine similarity) between two numeric arrays."
      );
    });

    it("should have all expected filters", () => {
      const filterNames = Object.keys(provider.__filterDoc);
      expect(filterNames).to.include.members([
        "inner_product",
        "cosine_distance",
        "distance",
      ]);
    });
  });

  describe("findFilter", () => {
    it("should find existing filters", () => {
      const tokens = lexDocument("inner_product").tokens;
      const result = provider.findFilter(0, tokens);
      expect(result).to.equal("inner_product");
    });

    it("should return null for non-existent filters", () => {
      const tokens = lexDocument("nonexistent_filter").tokens;
      const result = provider.findFilter(0, tokens);
      expect(result).to.be.null;
    });

    it("should return null for non-identifier tokens", () => {
      const tokens = lexDocument("=").tokens;
      const result = provider.findFilter(0, tokens);
      expect(result).to.be.null;
    });
  });

  describe("isMatch", () => {
    it("should match filters in search context after pipe", () => {
      const code =
        "query books { where = $db.embedding.vector|inner_product:$input.query_vector }";
      const tokens = lexDocument(code).tokens;

      // Find the index of 'inner_product' token
      const innerProductIndex = tokens.findIndex(
        (token) => token.image === "inner_product"
      );
      expect(innerProductIndex).to.be.greaterThan(-1);

      const result = provider.isMatch(innerProductIndex, tokens);
      expect(result).to.be.true;
    });

    it("should not match filters outside search context", () => {
      const code =
        "query books { stack { var $result { value = inner_product } } }";
      const tokens = lexDocument(code).tokens;

      // Find the index of 'inner_product' token
      const innerProductIndex = tokens.findIndex(
        (token) => token.image === "inner_product"
      );
      expect(innerProductIndex).to.be.greaterThan(-1);

      const result = provider.isMatch(innerProductIndex, tokens);
      expect(result).to.be.false;
    });

    it("should not match when there's no pipe before the token", () => {
      const code = "query books { where = $db.embedding.vector inner_product }";
      const tokens = lexDocument(code).tokens;

      // Find the index of 'inner_product' token
      const innerProductIndex = tokens.findIndex(
        (token) => token.image === "inner_product"
      );
      expect(innerProductIndex).to.be.greaterThan(-1);

      const result = provider.isMatch(innerProductIndex, tokens);
      expect(result).to.be.false;
    });

    it("should not match at index 0", () => {
      const tokens = lexDocument("inner_product").tokens;
      const result = provider.isMatch(0, tokens);
      expect(result).to.be.false;
    });

    it("should handle complex search expressions", () => {
      const code =
        "query books { where = $db.embedding.vector|cosine_distance:$input.query_vector } as $matched_books";
      const tokens = lexDocument(code).tokens;

      // Find the index of 'cosine_distance' token
      const cosineDistanceIndex = tokens.findIndex(
        (token) => token.image === "cosine_distance"
      );
      expect(cosineDistanceIndex).to.be.greaterThan(-1);

      const result = provider.isMatch(cosineDistanceIndex, tokens);
      expect(result).to.be.true;
    });
  });

  describe("render", () => {
    it("should render documentation for existing filters", () => {
      const tokens = lexDocument("inner_product").tokens;
      const result = provider.render(0, tokens);
      expect(result).to.include(
        "Provides the inner product between two vectors"
      );
    });

    it("should return undefined for non-matching tokens", () => {
      const tokens = lexDocument("nonexistent_filter").tokens;
      const result = provider.render(0, tokens);
      expect(result).to.be.undefined;
    });
  });
});
