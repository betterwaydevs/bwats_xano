import { ExclamationToken } from "../../lexer/cast.js";
import { CommentToken } from "../../lexer/comment.js";
import { LCurly, RCurly } from "../../lexer/control.js";
import { NewlineToken } from "../../lexer/tokens.js";

export const DEFAULT_OPTIONS = {
  allowExpectStatements: false,
  allowCallStatements: false,
};

/**
 * Similar to stackClause, but without the stack token
 * this is so it can be used in a group, conditional, loops...
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function nakedStackFn($) {
  return (options = {}) => {
    options = { ...DEFAULT_OPTIONS, ...options };

    $.sectionStack.push("nakedStackFn");
    $.CONSUME(LCurly); // "{"
    $.MANY(() => {
      $.AT_LEAST_ONE1(() => $.CONSUME1(NewlineToken)); // required new line before each clause
      $.OPTION(() => $.CONSUME(ExclamationToken)); // optional "!" to continue on error
      $.OR([
        { ALT: () => $.CONSUME(CommentToken) },
        { ALT: () => $.SUBRULE($.aiFn) },
        { ALT: () => $.SUBRULE($.dbFn) },
        { ALT: () => $.SUBRULE($.varFn) },
        { ALT: () => $.SUBRULE($.arrayFn) },
        { ALT: () => $.SUBRULE($.cloudFn) },
        { ALT: () => $.SUBRULE($.securityFn) },
        { ALT: () => $.SUBRULE($.mathFn) },
        { ALT: () => $.SUBRULE($.textFn) },
        { ALT: () => $.SUBRULE($.utilFn) },
        { ALT: () => $.SUBRULE($.preconditionFn) },
        { ALT: () => $.SUBRULE($.zipFn) },
        { ALT: () => $.SUBRULE($.objectFn) },
        { ALT: () => $.SUBRULE($.apiFn, { ARGS: [options] }) },
        { ALT: () => $.SUBRULE($.webflowFn) },
        { ALT: () => $.SUBRULE($.redisFn) },
        { ALT: () => $.SUBRULE($.controlFn, { ARGS: [options] }) },
        { ALT: () => $.SUBRULE($.debugFn) },
        { ALT: () => $.SUBRULE($.storageFn) },
        { ALT: () => $.SUBRULE($.streamFn) },
        { ALT: () => $.SUBRULE($.actionCallFn) },
        {
          GATE: () => options.allowCallStatements,
          ALT: () => $.SUBRULE($.toolCallFn),
        },
        {
          GATE: () => options.allowCallStatements,
          ALT: () => $.SUBRULE($.addonCallFn),
        },
        {
          GATE: () => options.allowCallStatements,
          ALT: () => $.SUBRULE($.middlewareCallFn),
        },
        {
          GATE: () => options.allowExpectStatements,
          ALT: () => $.SUBRULE($.workflowExpectFn),
        },
      ]);
    });
    $.AT_LEAST_ONE2(() => $.CONSUME2(NewlineToken));
    $.CONSUME(RCurly); // "}"
    $.sectionStack.pop();
  };
}
