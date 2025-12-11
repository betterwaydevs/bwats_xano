import { LCurly, RCurly } from "../../lexer/control.js";
import { InputToken, NewlineToken } from "../../lexer/tokens.js";

/**
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function inputClause($) {
  return () => {
    $.sectionStack.push("inputClause");
    $.CONSUME(InputToken); // "input"
    // unlike schema, input can be mentioned without any fields
    $.OPTION(() => {
      $.CONSUME(LCurly); // "{"
      $.MANY(() => {
        $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // at least one new line
        $.SUBRULE($.optionalCommentBlockFn);

        $.OR([
          { ALT: () => $.SUBRULE($.objectColumnDefinition) },
          { ALT: () => $.SUBRULE($.enumColumnDefinition) },
          {
            ALT: () =>
              $.SUBRULE($.columnDefinition, { ARGS: [{ include_file: true }] }),
          },
          {
            ALT: () => $.SUBRULE($.dbLinkColumnDefinition),
          },
        ]);
      });
      $.AT_LEAST_ONE2(() => $.CONSUME2(NewlineToken)); // at least one new line
      $.CONSUME(RCurly); // "}"
    });
    $.sectionStack.pop();
  };
}
