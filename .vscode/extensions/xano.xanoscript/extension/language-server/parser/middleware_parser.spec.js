import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("middleware_parser", () => {
  it("should parse a basic middleware", () => {
    const parser = xanoscriptParser(`middleware foo {
      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("should not parse a basic a middleware with slashes", () => {
    const parser = xanoscriptParser(`middleware foo/bar {
      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  it("should parse a basic a string middleware url", () => {
    const parser = xanoscriptParser(`middleware "foo/bar" {
      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });

  it("middleware don't accept dynamic params", () => {
    const parser = xanoscriptParser(`middleware foo/{user_id} {
      input {
        text user_id filters=trim
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.not.be.empty;
  });

  describe("ResponseStrategy", () => {
    it("should parse middleware with response_strategy = 'merge'", () => {
      const parser = xanoscriptParser(`middleware test_merge {
        response_strategy = "merge"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse middleware with response_strategy = 'replace'", () => {
      const parser = xanoscriptParser(`middleware test_replace {
        response_strategy = "replace"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should error on invalid response_strategy value", () => {
      const parser = xanoscriptParser(`middleware test_invalid {
        response_strategy = "invalid"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.not.be.empty;
      expect(parser.errors[0].message).to.include('Invalid value "invalid"');
      expect(parser.errors[0].message).to.include(
        'Must be one of: "merge", "replace"'
      );
    });
  });

  describe("ExceptionPolicy", () => {
    it("should parse middleware with exception_policy = 'silent'", () => {
      const parser = xanoscriptParser(`middleware test_silent {
        exception_policy = "silent"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse middleware with exception_policy = 'rethrow'", () => {
      const parser = xanoscriptParser(`middleware test_rethrow {
        exception_policy = "rethrow"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should parse middleware with exception_policy = 'critical'", () => {
      const parser = xanoscriptParser(`middleware test_critical {
        exception_policy = "critical"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.be.empty;
    });

    it("should error on invalid exception_policy value", () => {
      const parser = xanoscriptParser(`middleware test_invalid {
        exception_policy = "invalid"

        input {
        }

        stack {
        }

        response = null
      }`);

      expect(parser.errors).to.not.be.empty;
      expect(parser.errors[0].message).to.include('Invalid value "invalid"');
      expect(parser.errors[0].message).to.include(
        'Must be one of: "silent", "rethrow", "critical"'
      );
    });
  });

  it("should parse middleware with both response_strategy and exception_policy", () => {
    const parser = xanoscriptParser(`middleware test_combined {
      response_strategy = "merge"
      exception_policy = "rethrow"

      input {
      }

      stack {
      }

      response = null
    }`);

    expect(parser.errors).to.be.empty;
  });
});
