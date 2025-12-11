import { expect } from "chai";
import { readdirSync, readFileSync } from "fs";
import findLast from "lodash-es/findLast.js";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer.js";

describe("Xanoscript Query Lexer", () => {
  it("Can Lex valid query sources", () => {
    const files = readdirSync("lexer/tests/query/valid_sources");
    files.forEach((file) => {
      const source = readFileSync(
        `lexer/tests/query/valid_sources/${file}`,
        "utf8"
      );
      const lexingResult = lexDocument(source);
      const { errors, tokens } = lexingResult;
      if (errors.length > 0) {
        let richErrors = errors.map((error) => {
          const previousToken = findLast(
            tokens,
            (token) => token.endOffset <= error.offset
          );
          return {
            name: error.message,
            file: `lexer/tests/query/valid_sources/${file}:${error.line}:${error.column}`,
            "prev. Token": previousToken ? previousToken.image : "N/A",
          };
        });

        console.table(richErrors);
      }

      expect(errors).to.be.empty;
    });
  });
});
