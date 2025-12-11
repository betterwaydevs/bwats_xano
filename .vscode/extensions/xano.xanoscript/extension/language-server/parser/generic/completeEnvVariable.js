import { DotToken, Identifier } from "../../lexer/tokens.js";
import {
  ApiBaseUrlVariable,
  BranchVariable,
  DatasourceVariable,
  EnvVariable,
  HttpHeadersVariable,
  RemoteHostVariable,
  RemoteIpVariable,
  RemotePasswordVariable,
  RemotePortVariable,
  RemoteUserVariable,
  RequestAuthTokenVariable,
  RequestMethod,
  RequestQuerystringVariable,
  RequestUriVariable,
  ShortFormVariable,
  TenantVariable,
  WebflowVariable,
} from "../../lexer/variables.js";

/**
 *
 * @param {import('../base_parser.js').XanoBaseParser} $
 * @returns
 */
export function completeEnvVariable($) {
  return () => {
    $.CONSUME(EnvVariable);
    $.OR([
      {
        ALT: () => {
          $.CONSUME(DotToken);
          $.OR1([
            { ALT: () => $.CONSUME(ApiBaseUrlVariable) },
            { ALT: () => $.CONSUME(BranchVariable) },
            { ALT: () => $.CONSUME(DatasourceVariable) },
            {
              ALT: () => {
                $.CONSUME(HttpHeadersVariable);
                $.SUBRULE($.singleChainedIdentifier);
              },
            },
            { ALT: () => $.CONSUME(RemoteHostVariable) },
            { ALT: () => $.CONSUME(RemoteIpVariable) },
            { ALT: () => $.CONSUME(RemotePasswordVariable) },
            { ALT: () => $.CONSUME(RemotePortVariable) },
            { ALT: () => $.CONSUME(RemoteUserVariable) },
            { ALT: () => $.CONSUME(RequestAuthTokenVariable) },
            { ALT: () => $.CONSUME(RequestMethod) },
            { ALT: () => $.CONSUME(RequestQuerystringVariable) },
            { ALT: () => $.CONSUME(RequestUriVariable) },
            { ALT: () => $.CONSUME(TenantVariable) },
            {
              ALT: () => {
                $.CONSUME(WebflowVariable);
                $.SUBRULE1($.singleChainedIdentifier);
              },
            },
            { ALT: () => $.CONSUME(Identifier) }, // environment variable don't have subfields
            {
              ALT: () => {
                const token = $.CONSUME(ShortFormVariable);
                $.addWarning(
                  `Using \`$\` prefixed environment variables '${token.image}' is discouraged.`,
                  token
                );
              },
            },
            { ALT: () => $.SUBRULE($.bracketAccessor) }, // e.g., .["key" ]
          ]);
        },
      },
      {
        ALT: () => $.SUBRULE1($.bracketAccessor),
      },
    ]);
  };
}
