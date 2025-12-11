import { arraySlice } from "./arraySlice.js";
import { columnDefinition } from "./columnDefinition.js";
import { dbLinkColumnDefinition } from "./dbLinkColumnDefinition.js";
import { enumColumnDefinition } from "./enumColumnDefinition.js";
import { filterDefinition } from "./filterDefinition.js";
import { objectColumnDefinition } from "./objectColumnDefinition.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.arraySlice = $.RULE("arraySlice", arraySlice($));
  $.columnDefinition = $.RULE("columnDefinition", columnDefinition($));
  $.dbLinkColumnDefinition = $.RULE(
    "dbLinkColumnDefinition",
    dbLinkColumnDefinition($)
  );
  $.enumColumnDefinition = $.RULE(
    "enumColumnDefinition",
    enumColumnDefinition($)
  );
  $.filterDefinition = $.RULE("filterDefinition", filterDefinition($));
  $.objectColumnDefinition = $.RULE(
    "objectColumnDefinition",
    objectColumnDefinition($)
  );
};
