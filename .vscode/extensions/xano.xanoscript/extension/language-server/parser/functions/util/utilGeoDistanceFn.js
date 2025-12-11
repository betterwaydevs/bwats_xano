import { GeoDistanceToken } from "../../../lexer/util.js";

/**
 * util.geo_distance {
 *   latitude_1 = 1
 *   longitude_1 = 2
 *   latitude_2 = 3
 *   longitude_2 = 4
 * } as $x6
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function utilGeoDistanceFn($) {
  return () => {
    const requiredAttrs = [
      "latitude_1",
      "longitude_1",
      "latitude_2",
      "longitude_2",
    ];
    const optionalAttrs = ["description", "disabled"];

    $.sectionStack.push("utilGeoDistanceFn");
    const fnToken = $.CONSUME(GeoDistanceToken); // "geo_distance"
    $.SUBRULE($.functionAttrReq, {
      ARGS: [fnToken, requiredAttrs, optionalAttrs],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
