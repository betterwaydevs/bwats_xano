import { expect } from "chai";
import { describe, it } from "mocha";
import { lexDocument } from "../../../lexer/lexer.js";
import { parser } from "../../test_parser.js";

function parse(inputText) {
  parser.reset();
  const lexResult = lexDocument(inputText);
  parser.input = lexResult.tokens;
  parser.utilGeoDistanceFn();
  return parser;
}

describe("utilGeoDistanceFn", () => {
  it("utilGeoDistanceFn accepts a latitude and longitude", () => {
    const parser = parse(`geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      latitude_2 = 3
      longitude_2 = 4
    } as $x1`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGeoDistanceFn accepts a description", () => {
    const parser = parse(`geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      latitude_2 = 3
      longitude_2 = 4
      description = "foo"
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGeoDistanceFn can be disabled", () => {
    const parser = parse(`geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      latitude_2 = 3
      longitude_2 = 4
      disabled = true
    } as $x4`);
    expect(parser.errors).to.be.empty;
  });

  it("utilGeoDistanceFn requires a latitude attr", () => {
    let parser = parse(`geo_distance {
      longitude_1 = 2
      latitude_2 = 3
      longitude_2 = 4
    } as $x4`);
    expect(parser.errors).to.not.be.empty;

    parser = parse(`geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      longitude_2 = 4
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });

  it("utilGeoDistanceFn requires a longitude attrs", () => {
    let parser = parse(`geo_distance {
      latitude_1 = 1
      latitude_2 = 3
      longitude_2 = 4
    } as $x4`);

    expect(parser.errors).to.not.be.empty;

    parser = parse(`geo_distance {
      latitude_1 = 1
      longitude_1 = 2
      latitude_2 = 3
    } as $x4`);
    expect(parser.errors).to.not.be.empty;
  });
});
