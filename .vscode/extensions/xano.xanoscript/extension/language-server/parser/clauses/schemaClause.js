import { CommentToken } from "../../lexer/comment.js";
import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken, SchemaToken } from "../../lexer/tokens.js";

const DEFAULT_CONFIG = {
  include_file: true,
  isTableSchema: false, // enforces that "id" column can only be int or uuid
};

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function schemaClause($) {
  return (config = {}, schema = {}) => {
    config = { ...DEFAULT_CONFIG, ...config };

    // if not provided, we'll include the file definition
    $.sectionStack.push("schemaClause");
    const parent = $.CONSUME(SchemaToken); // "schema"
    $.OPTION(() => {
      $.CONSUME(LCurly); // "{"
      $.MANY(() => {
        $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // at least one new line
        $.OR([
          { ALT: () => $.CONSUME(CommentToken) },
          {
            ALT: () => $.SUBRULE($.objectColumnDefinition, { ARGS: [schema] }),
          },
          { ALT: () => $.SUBRULE($.enumColumnDefinition, { ARGS: [schema] }) },
          {
            ALT: () =>
              $.SUBRULE($.columnDefinition, {
                ARGS: [
                  {
                    include_file: config.include_file,
                    isTableSchema: config.isTableSchema,
                  },
                  schema,
                ],
              }),
          },
        ]);
      });
      $.MANY1(() => $.CONSUME2(NewlineToken)); // at least one new line
      $.CONSUME(RCurly); // "}"
    });

    if (config.isTableSchema) {
      // a table should have an id column
      const idColumn = schema["id"];
      if (!idColumn) {
        $.addMissingError(
          parent,
          "{} must have an 'id' of type uuid or int column defined"
        );
      } else if (!["int", "uuid"].includes(idColumn.typeToken.image)) {
        $.addInvalidValueError(
          idColumn.typeToken,
          `The "id" column can only be of type "int" or "uuid"`
        );
      }
    }

    $.sectionStack.pop();
  };
}
