import { PipeToken } from "../../lexer/control.js";
import { DotToken, Identifier, NewlineToken } from "../../lexer/tokens.js";
import { LongFormVariable, ShortFormVariable } from "../../lexer/variables.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function assignableVariableProperty($) {
  return () => {
    let variableName = "";
    $.OR({
      DEF: [
        // "$users"
        {
          ALT: () => {
            const variable = $.CONSUME(ShortFormVariable);
            variableName = variable.image;
          },
        },
        // "$var.users"
        {
          ALT: () => {
            $.CONSUME(LongFormVariable);
            $.CONSUME(DotToken);
            const variable = $.CONSUME(Identifier);
            variableName = `$${variable.image}`;
          },
        },
      ],
      ERR_MSG: "expecting variable (e.g. $variable or $var.variable)",
    });
    $.SUBRULE($.chainedIdentifier);

    $.MANY({
      // This is a tricky one, we allow a new line breaking an expression but only
      // if the following line is a filter (starts with a pipe)
      // We use LookAhead to peek at the next tokens without consuming them
      // to decide if we should close or keep the gate open
      GATE: () =>
        $.LA(1).tokenType === PipeToken ||
        ($.LA(1).tokenType === NewlineToken && $.LA(2).tokenType === PipeToken),
      DEF: () => {
        $.SUBRULE($.filterFn);
      },
    });

    if (variableName) {
      $.addVariable(variableName, "unknown");
    }
  };
}
