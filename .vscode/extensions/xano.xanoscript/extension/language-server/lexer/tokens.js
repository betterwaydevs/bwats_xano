import { Lexer } from "chevrotain";
import { Identifier } from "./identifier.js";
import {
  createTokenByName,
  createUniqToken as createToken,
  createUniqToken,
} from "./utils.js";

export const ObjectIdentifier = createToken({
  name: "ObjectIdentifier",
  pattern: /[0-9a-zA-Z_]\w*/,
});

export { Identifier };

import uniq from "lodash-es/uniq.js";
import {
  ActionTokens,
  mapTokenToType as mapActionTokenToType,
} from "./action.js";
import { AddonTokens, mapTokenToType as mapAddonTokenToType } from "./addon.js";
import { AgentTokens, mapTokenToType as mapAgentTokenToType } from "./agent.js";
import {
  AgentTriggerTokens,
  mapTokenToType as mapAgentTriggerTokenToType,
} from "./agent_trigger.js";
import { AiTokens, mapTokenToType as mapAiTokenToType } from "./ai.js";
import { ApiFnTokens, mapTokenToType as mapApiTokenToType } from "./api.js";
import {
  ApiGroupTokens,
  mapTokenToType as mapApiGroupTokenToType,
} from "./api_group.js";
import {
  ArrayFnTokens,
  mapTokenToType as mapArrayTokenToType,
} from "./arrays.js";
import {
  BranchTokens,
  mapTokenToType as mapBranchTokenToType,
} from "./branch.js";
import { CastTokens, mapTokenToType as mapCastTokenToType } from "./cast.js";
import { CloudTokens, mapTokenToType as mapCloudTokenToType } from "./cloud.js";
import {
  ColumnTokens,
  mapTokenToType as mapColumnTokenToType,
} from "./columns.js";
import {
  CommentTokens,
  mapTokenToType as mapCommentTokenToType,
} from "./comment.js";
import {
  ControlTokens,
  mapTokenToType as mapControlsTokenToType,
} from "./control.js";
import { DbTokens, mapTokenToType as mapDbTokenToType } from "./db.js";
import { DebugTokens, mapTokenToType as mapDebugTokenToType } from "./debug.js";
import {
  ExpectFnTokens,
  mapTokenToType as mapExpectTokenToType,
} from "./expect.js";
import {
  FunctionTokens,
  mapTokenToType as mapFunctionTokenToType,
} from "./function.js";
import {
  LiteralTokens,
  mapTokenToType as mapLiteralTokenToType,
} from "./literal.js";
import { mapTokenToType as mapMathTokenToType, MathTokens } from "./math.js";
import {
  mapTokenToType as mapMcpServerTokenToType,
  McpServerTokens,
} from "./mcp_server.js";
import {
  mapTokenToType as mapMcpServerTriggerTokenToType,
  McpServerTriggerTokens,
} from "./mcp_server_trigger.js";
import {
  mapTokenToType as mapMiddlewareTokenToType,
  MiddlewareTokens,
} from "./middleware.js";
import {
  mapTokenToType as mapMultilineTokenToType,
  MultilineTokens,
} from "./multiline.js";
import {
  mapTokenToType as mapObjectTokenToType,
  ObjectTokens,
} from "./object.js";
import { mapTokenToType as mapQueryTokenToType, QueryTokens } from "./query.js";
import {
  mapTokenToType as mapRealtimeTriggerTokenToType,
  RealtimeTriggerTokens,
} from "./realtime_trigger.js";
import { mapTokenToType as mapRedisTokenToType, RedisTokens } from "./redis.js";
import {
  mapTokenToType as mapSecurityTokenToType,
  SecurityTokens,
} from "./security.js";
import {
  mapTokenToType as mapStorageTokenToType,
  StorageTokens,
} from "./storage.js";
import {
  mapTokenToType as mapStreamTokenToType,
  StreamTokens,
} from "./stream.js";
import { mapTokenToType as mapTableTokenToType, TableTokens } from "./table.js";
import {
  mapTokenToType as mapTableTriggerTokenToType,
  TableTriggerTokens,
} from "./table_trigger.js";
import { mapTokenToType as mapTaskTokenToType, TaskTokens } from "./task.js";
import { mapTokenToType as mapTextTokenToType, TextTokens } from "./text.js";
import { mapTokenToType as mapToolTokenToType, ToolTokens } from "./tool.js";
import { mapTokenToType as mapUtilTokenToType, UtilTokens } from "./util.js";
import { mapTokenToType as mapVarTokenToType, VarTokens } from "./var.js";
import {
  mapTokenToType as mapVariableTokenToType,
  VariableTokens,
} from "./variables.js";
import {
  mapTokenToType as mapWorkflowTestTokenToType,
  WorkflowTestTokens,
} from "./workflow_test.js";
import {
  mapTokenToType as mapWorkspaceTokenToType,
  WorkspaceTokens,
} from "./workspace.js";
import {
  mapTokenToType as mapWorkspaceTriggerTokenToType,
  WorkspaceTriggerTokens,
} from "./workspace_trigger.js";
import { mapTokenToType as mapZipTokenToType, ZipTokens } from "./zip.js";

export const DotToken = createToken({ name: "Dot", pattern: /\./, label: "." });

export const TagsToken = createTokenByName("tags", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const NowToken = createTokenByName("now", {
  longer_alt: Identifier,
});

export const NullToken = createTokenByName("null", {
  longer_alt: Identifier,
});

// regular expression (regexp) pattern
export const RegExpToken = createToken({
  name: "RegExpToken",
  label: "regexp",
  pattern: /\/(?:[^/\n\\]|\\.)+\//,
});

export const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
  label: "whitespace",
});

export const NewlineToken = createToken({
  name: "NewlineToken",
  pattern: /(\r?\n)/,
});

export const TypeToken = createTokenByName("type", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const FieldToken = createTokenByName("field", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const TrueToken = createTokenByName("true", {
  longer_alt: Identifier,
});

export const FalseToken = createTokenByName("false", {
  longer_alt: Identifier,
});

export const InputToken = createTokenByName("input", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const StackToken = createTokenByName("stack", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const TestToken = createTokenByName("test", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const ResponseToken = createTokenByName("response", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const ViewToken = createTokenByName("view", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const MiddlewareToken = createTokenByName("middleware", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const DbReturnAggregateToken = createTokenByName("return_aggregate", {
  pattern: /return_aggregate/,
});

export const AuthToken = createTokenByName("auth", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const SecurityToken = createTokenByName("security", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const HistoryToken = createTokenByName("history", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const Cachetoken = createTokenByName("cache", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const GuidToken = createTokenByName("guid", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const SchemaToken = createTokenByName("schema", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const IndexToken = createTokenByName("index", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const ValuesToken = createTokenByName("values", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const ValueToken = createTokenByName("value", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// filters
export const FiltersToken = createTokenByName("filters", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

// special case filter for db links (table reference)
export const DbLinkToken = createUniqToken({
  name: "DbLinkFilter",
  label: "@",
  pattern: /@/,
});

// define the sensitivity of a column
export const SensitiveToken = createTokenByName("sensitive", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const DescriptionToken = createTokenByName("description", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const DisabledToken = createTokenByName("disabled", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const MockToken = createTokenByName("mock", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const DocsToken = createTokenByName("docs", {
  longer_alt: Identifier,
  categories: [Identifier], // could also be an identifier
});

export const DbIdentifier = createToken({
  name: "DbIdentifier",
  label: "db.identifier",
  pattern: /dbo=\d+/,
});

// "in"
export const JsonInToken = createUniqToken({
  name: "JsonInToken",
  pattern: /in/,
  label: "in",
  longer_alt: Identifier,
  categories: [Identifier],
});

export const allTokens = uniq([
  WhiteSpace,
  NewlineToken,
  ...MultilineTokens,
  ...CommentTokens, // Must come before ControlTokens to match // before single /
  RegExpToken,
  IndexToken,
  InputToken,
  DbReturnAggregateToken,
  FiltersToken,
  ...AgentTriggerTokens,
  ...McpServerTriggerTokens,
  ...McpServerTokens,
  ...RealtimeTriggerTokens,
  ...ArrayFnTokens,
  ...ColumnTokens,
  ...LiteralTokens,
  ...ControlTokens,
  ...QueryTokens,
  ...CastTokens,
  DbLinkToken,
  DbIdentifier,
  ValuesToken,
  ValueToken,
  TrueToken,
  FalseToken,
  TypeToken,
  FieldToken,
  AuthToken,
  GuidToken,
  SensitiveToken,
  TagsToken,
  DescriptionToken,
  DocsToken,
  DisabledToken,
  MockToken,
  SchemaToken,
  StackToken,
  TestToken,
  MiddlewareToken,
  ...MiddlewareTokens,
  ResponseToken,
  NullToken,
  NowToken,
  HistoryToken,
  Cachetoken,
  SecurityToken,
  ...StorageTokens,
  ...ZipTokens,
  ...FunctionTokens,
  ...SecurityTokens,
  ...UtilTokens,
  ...TableTriggerTokens,
  ...WorkspaceTriggerTokens,
  ...TaskTokens,
  ...WorkflowTestTokens,
  ...ApiGroupTokens,
  ...ApiFnTokens,
  ...VariableTokens,
  ...TableTokens,
  ...CloudTokens,
  ...DbTokens,
  ...RedisTokens,
  ...TextTokens,
  ...ObjectTokens,
  ...StreamTokens,
  ...DebugTokens,
  ...ExpectFnTokens,
  ...VarTokens,
  ...MathTokens,
  ...AiTokens, // AI tokens must come before AgentTokens to avoid conflicts
  ...AgentTokens, // Must come before ToolTokens because of ToolsToken
  ...ToolTokens,
  ...AddonTokens,
  ...ActionTokens,
  ...BranchTokens,
  ...WorkspaceTokens,
  ViewToken,
  JsonInToken,
  DotToken,
  Identifier, // General identifier last to catch unmatched words
]);

const tokenMappers = [
  mapAddonTokenToType,
  mapActionTokenToType,
  mapAiTokenToType,
  mapAgentTokenToType,
  mapAgentTriggerTokenToType,
  mapApiGroupTokenToType,
  mapApiTokenToType,
  mapArrayTokenToType,
  mapBranchTokenToType,
  mapCastTokenToType,
  mapCloudTokenToType,
  mapColumnTokenToType,
  mapCommentTokenToType,
  mapControlsTokenToType,
  mapDbTokenToType,
  mapDebugTokenToType,
  mapExpectTokenToType,
  mapFunctionTokenToType,
  mapLiteralTokenToType,
  mapMathTokenToType,
  mapMcpServerTokenToType,
  mapMcpServerTriggerTokenToType,
  mapMiddlewareTokenToType,
  mapMultilineTokenToType,
  mapObjectTokenToType,
  mapQueryTokenToType,
  mapRealtimeTriggerTokenToType,
  mapRedisTokenToType,
  mapSecurityTokenToType,
  mapStorageTokenToType,
  mapStreamTokenToType,
  mapTableTokenToType,
  mapTableTriggerTokenToType,
  mapTaskTokenToType,
  mapTextTokenToType,
  mapToolTokenToType,
  mapUtilTokenToType,
  mapVarTokenToType,
  mapVariableTokenToType,
  mapWorkflowTestTokenToType,
  mapWorkspaceTokenToType,
  mapWorkspaceTriggerTokenToType,
  mapZipTokenToType,
];

/**
 * Map a token to a type (e.g., keyword, variable, etc.)
 * @param {import('chevrotain').TokenType} token
 * @returns string | null | undefined The type of the token
 */
export function mapTokenToType(token) {
  // Check if the token is a keyword
  for (const mapper of tokenMappers) {
    const type = mapper(token);
    if (type) {
      return type;
    }
  }

  switch (token) {
    // Structural and control keywords (e.g., query blocks, conditionals)
    case Cachetoken.name:
    case HistoryToken.name:
    case IndexToken.name:
    case InputToken.name:
    case MiddlewareToken.name:
    case MockToken.name:
    case ResponseToken.name:
    case ViewToken.name:
    case SchemaToken.name:
    case SecurityToken.name:
    case StackToken.name:
    case TestToken.name:
    case FiltersToken.name:
      return "keyword";

    case DbLinkToken.name:
      return "function";

    // Variable-related tokens
    case AuthToken.name:
    case DbIdentifier.name:
    case DbReturnAggregateToken.name:
    case DescriptionToken.name:
    case DisabledToken.name:
    case DocsToken.name:
    case FieldToken.name: // field is also used as variable name in index definitio.namen
    case GuidToken.name:
    case SensitiveToken.name:
    case TagsToken.name:
    case TypeToken.name: // type is used as a variable name in index definitio.namen
    case ValueToken.name:
    case ValuesToken.name:
      return "variable";

    case Identifier.name:
      return "property";

    case FalseToken.name:
    case NowToken.name:
    case NullToken.name:
    case TrueToken.name:
      return "enumMember";

    case DotToken.name:
      return "punctuation";

    case RegExpToken.name:
      return "regexp";

    case JsonInToken.name:
      return "operator";

    // Skip whitespace and newlines
    case NewlineToken.name:
    case WhiteSpace.name:
      return null;

    default:
      return undefined; // Skip unmapped or unknown tokens
  }
}
