import { IntegerLiteral } from "../../lexer/literal.js";
import { DotToken, Identifier } from "../../lexer/tokens.js";
import { ShortFormVariable } from "../../lexer/variables.js";

/**
 * to be used after a variable to reference their properties
 * like foo.bar.x[1].y[2].z
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function chainedIdentifier($) {
  return () => {
    $.MANY(() => $.SUBRULE($.singleChainedIdentifier));
  };
}

/**
 * to be used after a variable to reference a single property depth
 * like foo.bar , foo[1] or foo["key"]
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function singleChainedIdentifier($) {
  return () => {
    $.OR([
      {
        ALT: () => {
          $.CONSUME(DotToken);
          $.OR1([
            {
              ALT: () => {
                const token = $.CONSUME(ShortFormVariable);
                $.addWarning(
                  `Using \`$\` prefixed properties '${token.image}' is discouraged.`,
                  token
                );
              },
            }, // e.g., .bar
            { ALT: () => $.CONSUME(Identifier) }, // e.g., .bar
            { ALT: () => $.CONSUME2(IntegerLiteral) }, // e.g., .3
            { ALT: () => $.SUBRULE($.bracketAccessor) }, // e.g., .["key"]
          ]);
        },
      },
      { ALT: () => $.SUBRULE1($.bracketAccessor) }, // e.g., .["key"]
    ]);
  };
}
