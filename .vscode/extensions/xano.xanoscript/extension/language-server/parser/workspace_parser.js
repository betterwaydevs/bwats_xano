import { StringLiteral } from "../lexer/literal.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";
import { WorkspaceToken } from "../lexer/workspace.js";

export function workspaceDeclaration($) {
  return () => {
    $.sectionStack.push("workspaceDeclaration");
    // Allow leading comments and newlines before the workspace declaration
    $.SUBRULE($.optionalCommentBlockFn);

    const parent = $.CONSUME(WorkspaceToken); // workspace
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parent,
        {
          "env?": { "[string]": "[string]" },
          "acceptance?": { "ai_terms?": "[boolean]" },
          "description?": "[string]",
          "preferences?": {
            "internal_docs?": "[boolean]",
            "sql_columns?": "[boolean]",
            "sql_names?": "[boolean]",
            "track_performance?": "[boolean]",
          },
          "realtime?": { "canonical?": "[string]" },
        },
      ],
    });

    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
