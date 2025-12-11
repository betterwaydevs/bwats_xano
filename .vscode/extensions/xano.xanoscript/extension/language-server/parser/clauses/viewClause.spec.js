import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.viewClause();
  return parser;
}

describe("viewClause", () => {
  it("viewClause accepts a basic view with search, sort and id", () => {
    const parser = parse(`view = {
      "pending applications": {
        search: $db.status == "pending"
        sort  : {id: "rand"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts a hide attribute", () => {
    const parser = parse(`view = {
      "pending applications": {
        hide: ["created_at"];
        sort  : {id: "rand"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts multiple views in an object", () => {
    const parser = parse(`view = {
      "pending applications": {
        search: $db.status == "pending"
        sort  : {id: "rand"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
      "what is that?": {
        alias : "that_alias"
        search: $db.status == "pending"
        sort  : {id: "asc"}
        id    : "07a2ebcd-3361-425c-8f7f-ed8981dca0d1"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts different sort directions", () => {
    const parser = parse(`view = {
      "ascending": {
        search: $db.status == "pending"
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
      "descending": {
        search: $db.status == "pending"
        sort  : {id: "desc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
      "random": {
        search: $db.status == "pending"
        sort  : {id: "rand"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts an alias property", () => {
    const parser = parse(`view = {
      "aliased view": {
        alias : "that_alias"
        search: $db.status == "pending"
        sort  : {id: "asc"}
        id    : "07a2ebcd-3361-425c-8f7f-ed8981dca0d1"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts complex search expressions", () => {
    const parser = parse(`view = {
      "complex search": {
        search: $db.status == "pending" && $db.created_at > "2023-01-01"
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts multiple sort fields", () => {
    const parser = parse(`view = {
      "multiple sorts": {
        search: $db.status == "pending"
        sort  : {
          created_at: "desc"
          name: "asc"
        }
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause requires either a search or hide criteria", () => {
    const parser = parse(`view = {
      "no search criteria": {
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("viewClause accepts a view with numeric keys in search criteria", () => {
    const parser = parse(`view = {
      "numeric search": {
        search: $db.count > 5
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts a view with complex boolean logic", () => {
    const parser = parse(`view = {
      "complex logic": {
        search: ($db.status == "pending" || $db.status == "active") && $db.created_at > "2023-01-01"
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("viewClause accepts a view with special characters in name", () => {
    const parser = parse(`view = {
      "view-with_special.chars!": {
        search: $db.status == "pending"
        sort  : {id: "asc"}
        id    : "9ed7daad-682f-455e-bf02-ca53444cd429"
      }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
