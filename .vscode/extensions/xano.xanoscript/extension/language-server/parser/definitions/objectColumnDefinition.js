import { ObjectToken } from "../../lexer/columns.js";
import { Question } from "../../lexer/control.js";
import { Identifier } from "../../lexer/tokens.js";
import { getVarName } from "../generic/utils.js";

/**
 * special case of object definition allowing a sub schema to be defined, .e.g.:
 *     object object_column? {
 *       schema {
 *         int id
 *         text name
 *       }
 *     }
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function objectColumnDefinition($) {
  return (schema = {}) => {
    $.sectionStack.push("objectColumnDefinition");
    const parent = $.CONSUME(ObjectToken); // "object"

    let iterable = false;
    const nullable = false; // objects cannot be nullable
    let optional = false;

    $.OPTION2(() => {
      // object[]
      iterable = true;
      $.SUBRULE($.arraySlice);
    });

    // Column name (e.g., "user_id", "optional_column", "required_column")
    const name = $.CONSUME(Identifier);

    // add variable to schema
    schema[getVarName(name)] = {
      typeToken: parent,
      nameToken: name,
    };

    // ? (is it an optional field)
    $.OPTION(() => {
      optional = true;
      $.CONSUME(Question);
    });

    $.SUBRULE($.objectColumnMetadataDefinition); // Object metadata

    $.addInput(name.image, "enum", iterable, nullable, optional);

    $.sectionStack.pop();
  };
}
