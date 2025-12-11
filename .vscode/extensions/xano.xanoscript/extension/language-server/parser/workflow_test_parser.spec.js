import { expect } from "chai";
import { describe, it } from "mocha";
import { xanoscriptParser } from "./parser.js";

describe("workflow_test_parser", () => {
  it("should parse a basic workflow test with expect", () => {
    const parser = xanoscriptParser(`workflow_test foo {
      stack {
        var $a {
          value = 22
        }
        var $b {
          value = $a + 20
        }

        expect.to_equal ($b) {
          value = 42
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should be able to call an addon function in a workflow test", () => {
    const parser = xanoscriptParser(`workflow_test test {
      stack {
        addon.call "" {
          input = {ids: []|push:1|push:2}
        } as $addon1
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a workflow test with a function test call", () => {
    const parser = xanoscriptParser(`workflow_test foo {
      stack {
        function.call add {
          input = {a: 5, b: 10}
        } as $sums
      
        expect.to_equal ($sum) {
          value = 15
        }
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a workflow test with a task test call", () => {
    const parser = xanoscriptParser(`workflow_test foo {
      stack {
        task.call "count to 10" as $test1
      }
    }`);
    expect(parser.errors).to.be.empty;
  });

  it("should parse a workflow test with an api call", () => {
    const parser = xanoscriptParser(`workflow_test foo {
      stack {
        api.call sum verb=GET {
          api_group = "new api"
          headers = ""
          input = {a: 22, b: 33}
        } as $sum
      }
    }`);
    expect(parser.errors).to.be.empty;
  });
});
