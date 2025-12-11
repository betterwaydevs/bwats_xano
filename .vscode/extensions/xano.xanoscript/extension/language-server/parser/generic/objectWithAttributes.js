import { ExclamationToken } from "../../lexer/cast.js";
import { ColonToken, CommaToken, LCurly, RCurly } from "../../lexer/control.js";
import { StringLiteral } from "../../lexer/literal.js";
import { Identifier, NewlineToken } from "../../lexer/tokens.js";
import { getVarName } from "./utils.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function objectWithAttributes($) {
  return (options = {}) => {
    const keys = [];

    const parent = $.CONSUME(LCurly); // "{"
    $.MANY(() => $.CONSUME(NewlineToken));
    $.MANY_SEP({
      SEP: NewlineToken,
      DEF: () => {
        let hasAtLeastOneAttribute = false;
        let has_separator = false;
        // single line definition separated by commas
        $.MANY1(() => {
          // multi line, each key value pair on a new line
          // {
          //   key: value
          //   key2: value2
          // }

          // if we have at least one attribute, the separator is required
          if (hasAtLeastOneAttribute && !has_separator) {
            $.addMissingError(
              parent,
              "Expected a separator between attributes"
            );
          }

          // optionally consume as many new line present
          // $.MANY2(() => $.CONSUME2(NewlineToken));
          $.OPTION1({
            GATE: () => options.allowDisabledKeys === true,
            DEF: () => $.CONSUME(ExclamationToken),
          });
          const key = $.OR1([
            { ALT: () => $.CONSUME2(Identifier) }, // my_key
            { ALT: () => $.CONSUME2(StringLiteral) }, // "my key"
          ]);

          // prevent duplicate keys
          const varName = getVarName(key);
          if (keys.includes(varName)) {
            $.addDuplicateAttributeError(key);
          } else {
            keys.push(varName);
          }

          $.CONSUME(ColonToken); // ":"
          $.SUBRULE($.expressionFn, { ARGS: [key, options] }); // e.g., "A value of the field"

          $.OPTION(() => {
            $.CONSUME(CommaToken);
            has_separator = true;
          });

          // mark that we have our first attribute in, we will require a separator
          // to add more attributes
          hasAtLeastOneAttribute = true;
        });
      },
    });

    $.MANY3(() => $.CONSUME3(NewlineToken));
    $.CONSUME(RCurly); // "}"
  };
}
