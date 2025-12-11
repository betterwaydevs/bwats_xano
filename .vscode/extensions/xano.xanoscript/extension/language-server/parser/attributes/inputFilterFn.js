import { ExclamationToken } from "../../lexer/cast.js";
import { ColonToken } from "../../lexer/control.js";
import {
  FloatLiteral,
  IntegerLiteral,
  StringLiteral,
} from "../../lexer/literal.js";
import {
  DbIdentifier,
  DbLinkToken,
  FalseToken,
  Identifier,
  RegExpToken,
  TrueToken,
} from "../../lexer/tokens.js";
import { inputFilterNames } from "../generic/filterNames.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function inputFilterFn($) {
  /**
   * @param {string} inputTypeToken the type of the input, e.g., "object", "array", etc.
   */
  return (inputTypeToken) => {
    $.sectionStack.push("inputFilterFn");
    $.OR([
      {
        ALT: () => {
          $.OPTION(() => $.CONSUME(ExclamationToken));
          const filter = $.CONSUME(Identifier);
          $.MANY1(() => {
            $.CONSUME1(ColonToken);
            $.OR2([
              { ALT: () => $.CONSUME2(Identifier) },
              { ALT: () => $.CONSUME1(StringLiteral) },
              { ALT: () => $.CONSUME1(RegExpToken) },
              { ALT: () => $.CONSUME1(IntegerLiteral) },
              { ALT: () => $.CONSUME1(FloatLiteral) },
              { ALT: () => $.CONSUME1(FalseToken) },
              { ALT: () => $.CONSUME1(TrueToken) },
            ]);
          });

          // Note: For input filters, we only validate against inputFilterNames when inputTypeToken is provided
          // We don't validate against the general filterNames list since input filters have different rules
          if (
            inputTypeToken &&
            inputFilterNames[inputTypeToken.image] &&
            !inputFilterNames[inputTypeToken.image].includes(filter.image)
          ) {
            $.addInvalidValueError(
              filter,
              `Filter '${filter.image}' cannot be applied to input of type '${inputTypeToken.image}'`
            );
          }
        },
      },
      {
        ALT: () => {
          $.CONSUME(DbLinkToken);
          $.CONSUME2(ColonToken);
          $.CONSUME(DbIdentifier);
        },
      },
    ]);

    $.sectionStack.pop();
  };
}
