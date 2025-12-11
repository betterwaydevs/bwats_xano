import { CallToken } from "../../../lexer/api.js";
import { EqualToken } from "../../../lexer/control.js";
import { StringLiteral } from "../../../lexer/literal.js";
import {
  DELETEToken,
  GETToken,
  PATCHToken,
  POSTToken,
  PUTToken,
  VerbToken,
} from "../../../lexer/query.js";
import { Identifier } from "../../../lexer/tokens.js";

/**
 * @param {import('../../base_parser.js').XanoBaseParser} $
 */
export function apiCallFn($) {
  return () => {
    $.sectionStack.push("apiCallFn");
    const fnToken = $.CONSUME(CallToken); // "call"
    $.OR([
      { ALT: () => $.CONSUME(StringLiteral) }, // "foo/bar"
      { ALT: () => $.CONSUME(Identifier) }, // foo
    ]);
    $.CONSUME(VerbToken);
    $.CONSUME(EqualToken);
    $.OR1([
      { ALT: () => $.CONSUME(DELETEToken) },
      { ALT: () => $.CONSUME(GETToken) },
      { ALT: () => $.CONSUME(PATCHToken) },
      { ALT: () => $.CONSUME(POSTToken) },
      { ALT: () => $.CONSUME(PUTToken) },
    ]);
    $.SUBRULE($.schemaParseAttributeFn, {
      ARGS: [
        fnToken,
        {
          api_group: "[string]",
          "description?": "[string]",
          "disabled?": "[boolean]",
          "headers?": "[expression]",
          "input?": { "[string]": "[expression]" },
        },
      ],
    });
    $.SUBRULE($.asVariable, { ARGS: [fnToken] });
    $.sectionStack.pop();
  };
}
