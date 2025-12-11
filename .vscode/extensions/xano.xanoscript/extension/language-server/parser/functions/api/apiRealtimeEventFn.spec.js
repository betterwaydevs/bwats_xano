import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.apiRealtimeEventFn();
  return parser;
}

describe("apiRealtimeEventFn", () => {
  it("accepts minimal fieldset", () => {
    const parser = parse(`realtime_event {
      channel = "my_users_evt"
      data = $data_msg
      auth_table = "37"
      auth_id = $auth.id
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("can be disabled", () => {
    const parser = parse(`realtime_event {
      channel = "my_users_evt"
      data = $data_msg
      auth_table = "37"
      auth_id = $auth.id
      disabled = true
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("accepts a description", () => {
    const parser = parse(`realtime_event {
      description = "realtime_event {function"
      channel = "my_users_evt"
      data = $data_msg
      auth_table = "37"
      auth_id = $auth.id
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("requires a channel field", () => {
    const parser = parse(`realtime_event {
      data = $data_msg
      auth_table = "37"
      auth_id = $auth.id
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("requires a data field", () => {
    const parser = parse(`realtime_event {
      channel = "my_users_evt"
      auth_table = "37"
      auth_id = $auth.id
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("requires a auth_table field", () => {
    const parser = parse(`realtime_event {
      channel = "my_users_evt"
      data = $data_msg
      auth_id = $auth.id
    }`);
    expect(parser.errors).to.not.be.empty;
  });

  it("requires a auth_id field", () => {
    const parser = parse(`realtime_event {
      channel = "my_users_evt"
      data = $data_msg
      auth_table = "37"
    }`);
    expect(parser.errors).to.not.be.empty;
  });
});
