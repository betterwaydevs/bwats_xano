import { EnumToken } from "../../lexer/columns.js";
import { Question } from "../../lexer/control.js";
import { Identifier } from "../../lexer/identifier.js";
import { getVarName } from "../generic/utils.js";

/**
 * special case of enum field definition allowing a list of values to be defined, .e.g.:
 *     enum status {
 *       values = ["active", "inactive"]
 *    }
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function enumColumnDefinition($) {
  return (schema = {}) => {
    $.sectionStack.push("enumColumnDefinition");
    const parent = $.CONSUME(EnumToken); // "enum"
    let iterable = false;
    let nullable = false;
    let optional = false;

    $.OPTION1(() => {
      // enum[] ?
      iterable = true;
      $.SUBRULE($.arraySlice);
    });

    $.OPTION2(() => {
      nullable = true;
      $.CONSUME(Question);
    }); // ? (optional field)

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
      $.CONSUME1(Question);
    });

    $.OPTION3(() => $.SUBRULE($.columnDefaultValueAttribute)); // Optional default value
    $.SUBRULE($.enumColumnMetadataDefinition, { ARGS: [parent] }); // Enum metadata

    // add the variable to the registry
    $.addInput(name.image, "enum", iterable, nullable, optional);

    $.sectionStack.pop();
  };
}
