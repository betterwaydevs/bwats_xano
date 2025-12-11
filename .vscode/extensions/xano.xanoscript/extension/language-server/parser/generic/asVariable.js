import { AsToken } from "../../lexer/control.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function asVariable($) {
  /**
   * @param {import('chevrotain').IToken} parent
   **/
  return (parent) => {
    let hasAs = false;
    $.OPTION(() => {
      hasAs = true;
      $.CONSUME(AsToken); // "as"
      $.SUBRULE($.assignableVariableProperty);
    });

    if (!hasAs && parent) {
      $.addWarning("`as <variable>` is missing", parent);
    }
  };
}
