import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("realtime_channel", () => {
  it("should parse a complete realtime_channel with all clauses", () => {
    const parser = xanoscriptParser(`realtime_channel "some-channel" {
      public_messaging = {active: false}
      private_messaging = {active: false}
      settings = {
        anonymous_clients: false
        nested_channels  : false
        message_history  : 0
        auth_channel     : false
        presence         : false
      }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
