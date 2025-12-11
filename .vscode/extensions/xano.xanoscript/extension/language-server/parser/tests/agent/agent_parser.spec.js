import { expect } from "chai";
import { readdirSync, readFileSync } from "fs";
import { truncate } from "lodash-es";
import { describe, it } from "mocha";
import { dirname, join } from "path";
import { xanoscriptParser } from "../../parser.js";

describe("Xanoscript Agent Parser", () => {
  it("parses all the valid sources", () => {
    const errors = [];
    const files = readdirSync(
      join(dirname("./"), "parser/tests/agent/valid_sources")
    );
    files.forEach((file) => {
      const source = readFileSync(
        join(dirname("./"), "parser/tests/agent/valid_sources", file),
        "utf8"
      );
      const parser = xanoscriptParser(source);

      if (parser.errors.length > 0) {
        parser.errors.forEach((error) => {
          errors.push({
            previous: error.previousToken
              ? `${error.previousToken.tokenType.name} (${truncate(
                  error.previousToken.image,
                  {
                    length: 20,
                  }
                )})`
              : "N/A",
            file: `parser/tests/agent/valid_sources/${file}:${error.token.startLine}:${error.token.startColumn}`,
            stack: parser.sectionStack[parser.sectionStack.length - 1],
            message: truncate(error.message, { length: 50 }),
            token: `${error.token.tokenType.name} (${truncate(
              error.token.image,
              {
                length: 20,
              }
            )})`,
          });
        });
      }
    });

    if (errors.length > 0) {
      console.table(errors);
    }

    expect(errors).to.be.empty;
  });
});
