import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("workspace_parser", () => {
  it("should parse a basic workspace with identifier", () => {
    const parser = xanoscriptParser(`workspace my_workspace`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a basic workspace with string literal", () => {
    const parser = xanoscriptParser(`workspace "my workspace"`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with description", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      description = "This is my workspace"
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with acceptance clause", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      acceptance = {
        ai_terms: true
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with preferences clause", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      preferences = {
        internal_docs: true
        sql_columns: false
        sql_names: true
        track_performance: false
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with realtime clause", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      realtime = {
        canonical: "wss://example.com"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with all clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      description = "Full workspace example"

      acceptance = {
        ai_terms: true
      }

      preferences = {
        internal_docs: true
        sql_columns: true
        sql_names: false
        track_performance: true
      }

      realtime = {
        canonical: "wss://example.com/realtime"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse workspace with partial preferences", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      preferences = {
        internal_docs: true
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should not allow duplicate acceptance clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      acceptance = {
        ai_terms: true
      }
      acceptance = {
        ai_terms: false
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should not allow duplicate description clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      description = "First description"
      description = "Second description"
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should not allow duplicate preferences clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      preferences = {
        internal_docs: true
      }
      preferences = {
        sql_columns: false
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should not allow duplicate realtime clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      realtime = {
        canonical: "wss://example.com"
      }
      realtime = {
        canonical: "wss://other.com"
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should require workspace name", () => {
    const parser = xanoscriptParser(`workspace {
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("should parse workspace with empty clauses", () => {
    const parser = xanoscriptParser(`workspace my_workspace {
      acceptance = {}
      preferences = {}
      realtime = {}
    }`);
    expect(parser.errors).to.be.empty;
  });
});
