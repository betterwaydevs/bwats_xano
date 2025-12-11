import { expect } from "chai";
import { describe, it } from "mocha";
import { getSchemaConstantValue, valueMatchRequirements } from "./utils.js";

describe("schema/utils", () => {
  describe("valueMatchRequirements", () => {
    it("should return the correct requirement for multi attributes", () => {
      expect(valueMatchRequirements("items", ["items"])).to.equal("items");
      expect(valueMatchRequirements("items", ["items*"])).to.equal("items*");
      expect(valueMatchRequirements("items", ["items?"])).to.equal("items?");
      expect(valueMatchRequirements("items", ["!items?"])).to.equal("!items?");
      expect(valueMatchRequirements("items", ["!items*"])).to.equal("!items*");
      expect(valueMatchRequirements("items", ["!items"])).to.equal("!items");
    });
  });

  describe("getSchemaConstantValue", () => {
    it("should return the constant value without modifiers", () => {
      // No changes were made to this function, so no tests were added.
      expect(getSchemaConstantValue("[string]")).to.equal("[string]");
      expect(getSchemaConstantValue("foo")).to.equal("foo");
      expect(getSchemaConstantValue("foo*")).to.equal("foo");
      expect(getSchemaConstantValue("foo?")).to.equal("foo");
      expect(getSchemaConstantValue("!foo?")).to.equal("foo");
    });
  });
});
