import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("table_trigger", () => {
  describe("basic structure", () => {
    it("should parse a basic table_trigger with identifier name", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse a table_trigger with string literal name", () => {
      const parser = xanoscriptParser(`table_trigger "foo" {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("table_trigger should not accept dynamic params", () => {
      const parser = xanoscriptParser(`table_trigger foo/{user_id} {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
          text user_id filters=trim
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });
  });

  describe("required clauses", () => {
    it("should error without table clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error without input clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error without stack clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should not error without actions", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });
  });

  describe("actions clause", () => {
    it("should parse actions with all four fields", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse actions with fields in any order", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {update: false, truncate: true, delete: false, insert: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should not error when actions is missing keys", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {insert: false, update: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should error when actions has a duplicate field", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, delete: false, truncate: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });
  });

  describe("optional clauses", () => {
    it("should parse with active clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        active = true

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse with datasources clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        datasources = ["db1", "db2"]

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse with description attribute", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        description = "This is a trigger"

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse with history clause", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        history = 100

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse with tags attribute", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        tags = ["tag1", "tag2"]

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse with all optional clauses", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        active = true
        datasources = ["db1"]
        description = "Full trigger"
        tags = ["tag1"]

        input {
        }

        history = 100

        stack {
        }
      }`);

      expect(parser.errors).to.be.empty;
    });
  });

  describe("clause ordering", () => {
    it("should parse with clauses in any order", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        active = true
        description = "Test"

        input {
        }

        stack {
        }

        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
      }`);

      expect(parser.errors).to.be.empty;
    });
  });

  describe("duplicate clauses", () => {
    it("should error with duplicate actions", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        actions = {delete: false, insert: true, update: false, truncate: true}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate active", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        active = true
        active = false

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate datasources", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        datasources = ["db1"]
        datasources = ["db2"]

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate table", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        table = "other"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate description", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        description = "First"
        description = "Second"

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate history", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        history = "inherit"

        history = 100

        stack {
        }
      }`);
      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate input", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate stack", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}

        input {
        }

        stack {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });

    it("should error with duplicate tags", () => {
      const parser = xanoscriptParser(`table_trigger foo {
        table = "blah"
        actions = {delete: true, insert: false, update: true, truncate: false}
        tags = ["tag1"]
        tags = ["tag2"]

        input {
        }

        stack {
        }
      }`);

      expect(parser.errors).to.not.be.empty;
    });
  });
});
