import { AddonToken } from "../lexer/addon.js";
import { CommentToken } from "../lexer/comment.js";
import { LCurly, RCurly } from "../lexer/control.js";
import { DbToken } from "../lexer/db.js";
import { StringLiteral } from "../lexer/literal.js";
import {
  DotToken,
  Identifier,
  NewlineToken,
  StackToken,
} from "../lexer/tokens.js";

/**
 * @param {import('./base_parser.js').XanoBaseParser} $
 * @returns
 */
export function addonDeclaration($) {
  return () => {
    let hasDescription = false;
    let hasInput = false;
    let hasStack = false;
    let hasTags = false;

    $.sectionStack.push("addonDeclaration");
    // Allow leading comments and newlines before the addon declaration
    $.SUBRULE($.optionalCommentBlockFn);
    const parent = $.CONSUME(AddonToken);
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE(() => $.CONSUME(NewlineToken)); // at least one new line
      $.OR2([
        { ALT: () => $.CONSUME(CommentToken) },
        {
          GATE: () => !hasDescription,
          ALT: () => {
            hasDescription = true;
            $.SUBRULE($.descriptionFieldAttribute);
          },
        },
        {
          GATE: () => !hasInput,
          ALT: () => {
            hasInput = true;
            $.SUBRULE($.inputClause);
          },
        },
        {
          GATE: () => !hasStack,
          ALT: () => {
            hasStack = true;
            $.CONSUME(StackToken);
            $.CONSUME1(LCurly); // "{"
            $.OPTION(() => {
              $.AT_LEAST_ONE1(() => $.CONSUME3(NewlineToken));
              $.CONSUME(DbToken); // "db"
              $.CONSUME(DotToken); // "."
              $.SUBRULE($.dbQueryFn);
            });
            $.AT_LEAST_ONE2(() => $.CONSUME4(NewlineToken));
            $.CONSUME1(RCurly); // "}"
          },
        },
        {
          GATE: () => !hasTags,
          ALT: () => {
            hasTags = true;
            $.SUBRULE($.tagsAttribute);
          },
        },
      ]);
    });

    if (!hasInput) {
      $.addMissingError(parent, "{} is missing an input clause");
    }

    if (!hasStack) {
      $.addMissingError(parent, "{} is missing a stack clause");
    }

    $.MANY1(() => $.CONSUME1(NewlineToken)); // optional new line
    $.CONSUME(RCurly); // "}"
    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
