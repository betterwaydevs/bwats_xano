import { schemaFn } from "./schemaFn.js";
import { schemaParseArrayFn } from "./schemaParseArrayFn.js";
import { schemaParseAttributeFn } from "./schemaParseAttributeFn.js";
import { schemaParseConstantFn } from "./schemaParseConstantFn.js";
import { schemaParseEnumFn } from "./schemaParseEnum.js";
import { schemaParseImmutableFn } from "./schemaParseImmutableFn.js";
import { schemaParseObjectFn } from "./schemaParseObjectFn.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.schemaFn = $.RULE("schemaFn", schemaFn($));
  $.schemaParseImmutableFn = $.RULE(
    "schemaParseImmutableFn",
    schemaParseImmutableFn($)
  );
  $.schemaParseEnumFn = $.RULE("schemaParseEnumFn", schemaParseEnumFn($));
  $.schemaParseConstantFn = $.RULE(
    "schemaParseConstantFn",
    schemaParseConstantFn($)
  );
  $.schemaParseArrayFn = $.RULE("schemaParseArrayFn", schemaParseArrayFn($));
  $.schemaParseObjectFn = $.RULE("schemaParseObjectFn", schemaParseObjectFn($));
  $.schemaParseAttributeFn = $.RULE(
    "schemaParseAttributeFn",
    schemaParseAttributeFn($)
  );
};
