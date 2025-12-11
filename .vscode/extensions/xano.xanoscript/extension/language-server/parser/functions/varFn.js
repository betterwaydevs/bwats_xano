import { DotToken } from "../../lexer/tokens.js";
import { UpdateToken, VarToken } from "../../lexer/var.js";
import { ShortFormVariable } from "../../lexer/variables.js";

/**
 * represent $var.x or $x, the only format accepting an assigment
 * @param {import('../base_parser.js').XanoBaseParser} $
 */
export function varFn($) {
  return () => {
    $.sectionStack.push("var");

    const nameToken = $.CONSUME(VarToken); // "var"
    $.OR([
      {
        // "var $users"
        ALT: () => {
          const variable = $.CONSUME(ShortFormVariable);
          if (variable.image) {
            // we can directly add the variable here but
            // not necessary for the `assignableVariableProperty` below
            // which will add it on its own
            $.addVariable(variable.image, "unknown");
          }
        },
      },
      {
        // "var.update $users"
        ALT: () => {
          $.CONSUME(DotToken);
          $.CONSUME(UpdateToken);
          $.SUBRULE($.assignableVariableProperty);
        },
      },
    ]);

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        nameToken,
        {
          value: "[expression]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "mock?": { "![string]": "[expression]" },
        },
      ],
    });

    $.sectionStack.pop();
  };
}
