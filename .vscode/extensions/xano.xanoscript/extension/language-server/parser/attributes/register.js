import { columnDefaultValueAttribute } from "./columnDefaultValueAttribute.js";
import { descriptionFieldAttribute } from "./descriptionFieldAttribute.js";
import { disabledFieldAttribute } from "./disabledFieldAttribute.js";
import { docsFieldAttribute } from "./docsFieldAttribute.js"
import { inputFilterFn } from "./inputFilterFn.js";
import { sensitiveFieldAttribute } from "./sensitiveFieldAttribute.js";
import { valueFieldAttribute } from "./valueFieldAttribute.js";
import { valuesFieldAttribute } from "./valuesFieldAttribute.js";

/**
 * Registers all the parsers in this folder
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export const register = ($) => {
  $.columnDefaultValueAttribute = $.RULE(
    "columnDefaultValueAttribute",
    columnDefaultValueAttribute($)
  );
  $.descriptionFieldAttribute = $.RULE(
    "descriptionFieldAttribute",
    descriptionFieldAttribute($)
  );
  $.disabledFieldAttribute = $.RULE(
    "disabledFieldAttribute",
    disabledFieldAttribute($)
  );
  $.docsFieldAttribute = $.RULE(
    "docsFieldAttribute",
    docsFieldAttribute($)
  );
  $.inputFilterFn = $.RULE("inputFilterFn", inputFilterFn($));
  $.sensitiveFieldAttribute = $.RULE(
    "sensitiveFieldAttribute",
    sensitiveFieldAttribute($)
  );
  $.valueFieldAttribute = $.RULE("valueFieldAttribute", valueFieldAttribute($));
  $.valuesFieldAttribute = $.RULE(
    "valuesFieldAttribute",
    valuesFieldAttribute($)
  );
};
