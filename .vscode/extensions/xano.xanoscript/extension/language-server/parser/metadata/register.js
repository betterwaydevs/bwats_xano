import { columnMetadataDefinition } from "./columnMetadataDefinition.js";
import { enumColumnMetadataDefinition } from "./enumColumnMetadataDefinition.js";
import { objectColumnMetadataDefinition } from "./objectColumnMetadataDefinition.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function register($) {
  $.columnMetadataDefinition = $.RULE(
    "columnMetadataDefinition",
    columnMetadataDefinition($)
  );
  $.enumColumnMetadataDefinition = $.RULE(
    "enumColumnMetadataDefinition",
    enumColumnMetadataDefinition($)
  );
  $.objectColumnMetadataDefinition = $.RULE(
    "objectColumnMetadataDefinition",
    objectColumnMetadataDefinition($)
  );
}
