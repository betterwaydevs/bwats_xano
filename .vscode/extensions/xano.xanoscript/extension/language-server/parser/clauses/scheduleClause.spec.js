import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../lexer/lexer.js";
import { parser } from "../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.scheduleClause();
  return parser;
}

describe("scheduleClause", () => {
  it("scheduleClause accepts an empty event", () => {
    const parser = parse(`schedule = []`);
    expect(parser.errors).to.be.empty;
  });

  it("scheduleClause accepts a start time alone", () => {
    const parser = parse(`schedule = [
      {starts_on: 2025-03-17 18:33:50+0000}
    ]`);
    expect(parser.errors).to.be.empty;
  });

  it("scheduleClause reject a schedule without a start time", () => {
    const parser = parse(`schedule = [
      {ends_on: 2025-03-17 18:33:50+0000, freq: 172800}
    ]`);
    expect(parser.errors).to.not.be.empty;
  });

  it("scheduleClause accepts a start time and frequency", () => {
    const parser = parse(`schedule = [
      {starts_on: 2025-03-17 18:33:55+0000, freq: 172800}
    ]`);
    expect(parser.errors).to.be.empty;
  });

  it("scheduleClause requires a commas when time is defined on a single line", () => {
    const parser = parse(`schedule = [
      {starts_on: 2025-03-17 18:33:55+0000 freq: 172800}
    ]`);
    expect(parser.errors).to.not.be.empty;
  });

  it("scheduleClause accepts a start time, frequency, and end time", () => {
    const parser = parse(`schedule = [
      {
        starts_on: 2025-03-17 18:34:02+0000
        freq: 604800
        ends_on: 2029-03-15 18:34:02+0000
      }
    ]`);
    expect(parser.errors).to.be.empty;
  });

  it("scheduleClause accepts multiple times", () => {
    const parser = parse(`schedule = [
      {starts_on: 2025-03-17 18:33:50+0000}
      {starts_on: 2025-03-17 18:33:55+0000, freq: 172800}
      {
        starts_on: 2025-03-17 18:34:02+0000
        freq: 604800
        ends_on: 2029-03-15 18:34:02+0000
      }
    ]`);
    expect(parser.errors).to.be.empty;
  });
});
