import { StringLiteral } from "../lexer/literal.js";
import { RealtimeChannelToken } from "../lexer/realtime_trigger.js";
import { Identifier, NewlineToken } from "../lexer/tokens.js";

export function realtimeChannelDeclaration($) {
  return () => {
    $.sectionStack.push("realtimeChannelDeclaration");
    // Allow leading comments and newlines before the realtime_channel declaration
    $.SUBRULE($.optionalCommentBlockFn);

    const parent = $.CONSUME(RealtimeChannelToken); // realtime_channel
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) },
      { ALT: () => $.CONSUME(Identifier) },
    ]);

    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        parent,
        {
          "description?": "[string]",
          "active?": "[boolean]",
          "public_messaging?": {
            "active?": "[boolean]",
            "auth?": "[boolean]",
          },
          "private_messaging?": {
            "active?": "[boolean]",
            "auth?": "[boolean]",
          },
          "settings?": {
            anonymous_clients: "[boolean]",
            nested_channels: "[boolean]",
            message_history: [0, 25, 50, 100, 250, 1000],
            auth_channel: "[boolean]",
            presence: "[boolean]",
          },
        },
      ],
    });

    $.MANY2(() => $.CONSUME2(NewlineToken)); // optional new line
    $.sectionStack.pop();
  };
}
