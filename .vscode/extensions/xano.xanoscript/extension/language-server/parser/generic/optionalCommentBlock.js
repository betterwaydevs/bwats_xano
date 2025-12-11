import { CommentToken } from "../../lexer/comment.js";
import { NewlineToken } from "../../lexer/tokens.js";

/**
 * Dynamicly raises error for missing and required attributes
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function optionalCommentBlockFn($) {
  return () => {
    $.sectionStack.push("optionalCommentBlockFn");
    $.MANY(() => {
      $.CONSUME(CommentToken);
      $.CONSUME(NewlineToken);
    });
    $.sectionStack.pop();
  };
}

/**
 * Dynamicly raises error for missing and required attributes
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function commentBlockFn($) {
  return () => {
    $.sectionStack.push("commentBlockFn");
    $.AT_LEAST_ONE(() => {
      $.CONSUME(CommentToken);
      $.CONSUME(NewlineToken);
    });
    $.sectionStack.pop();
  };
}
