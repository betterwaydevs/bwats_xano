import { Identifier } from "./identifier.js";
import { IntegerLiteral } from "./literal.js";
import { createTokenByName, createUniqToken } from "./utils.js";

// conditional
export const ConditionalToken = createTokenByName("conditional", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// if
export const IfToken = createTokenByName("if", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// else
export const ElseToken = createTokenByName("else", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// elseif
export const ElseifToken = createTokenByName("elseif", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// for
export const ForToken = createTokenByName("for", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// foreach
export const ForeachToken = createTokenByName("foreach", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// remove (foreach.remove)
export const RemoveToken = createTokenByName("remove", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// await
export const AwaitToken = createTokenByName("await", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// each
export const EachToken = createTokenByName("each", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// try_catch
export const TryCatchToken = createTokenByName("try_catch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// try
export const TryToken = createTokenByName("try", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// catch
export const CatchToken = createTokenByName("catch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// finally
export const FinallyToken = createTokenByName("finally", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// as
export const AsToken = createTokenByName("as", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// return
export const ReturnToken = createTokenByName("return", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// switch
export const SwitchToken = createTokenByName("switch", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// case
export const CaseToken = createTokenByName("case", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// default
export const DefaultToken = createTokenByName("default", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// while
export const WhileToken = createTokenByName("while", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// group
export const GroupToken = createTokenByName("group", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// throw
export const ThrowToken = createTokenByName("throw", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// break
export const BreakToken = createTokenByName("break", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// continue
export const ContinueToken = createTokenByName("continue", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// >
export const GreaterThan = createUniqToken({
  name: "GreaterThan",
  pattern: />/,
  label: ">",
});

// >=
export const GreaterThanOrEq = createUniqToken({
  name: "GreaterThanOrEqual",
  pattern: />=/,
  label: ">=",
});

// <
export const SmallerThan = createUniqToken({
  name: "SmallerThan",
  pattern: /</,
  label: "<",
});

// <=
export const SmallerThanOrEq = createUniqToken({
  name: "SmallerThanOrEq",
  pattern: /<=/,
  label: "<=",
});

// -
export const Minus = createUniqToken({
  name: "Minus",
  pattern: /-/,
  label: "-",
  longer_alt: IntegerLiteral,
});

// +
export const Plus = createUniqToken({
  name: "Plus",
  pattern: /\+/,
  label: "+",
});

// *
export const Multiply = createUniqToken({
  name: "Multiply",
  pattern: /\*/,
  label: "*",
});

// /
export const Divide = createUniqToken({
  name: "Divide",
  pattern: /\//,
  label: "/",
});

// %
export const Modulus = createUniqToken({
  name: "Modulus",
  pattern: /%/,
  label: "%",
});

// ==
export const IsEqual = createUniqToken({
  name: "IsEqual",
  label: "==",
  pattern: /==/,
});

// ===
export const IsStrictEqual = createUniqToken({
  name: "IsStrictEqual",
  label: "===",
  pattern: /===/,
});

// !=
export const IsNotEqual = createUniqToken({
  name: "IsNotEqual",
  label: "!=",
  pattern: /!=/,
});

// !==
export const IsStrictNotEqual = createUniqToken({
  name: "IsStrictNotEqual",
  label: "!==",
  pattern: /!==/,
});

// =
export const EqualToken = createUniqToken({
  name: "EqualToken",
  label: "=",
  pattern: /=/,
});

// {
export const LCurly = createUniqToken({
  name: "LCurly",
  pattern: /{/,
  label: "{",
});

// }
export const RCurly = createUniqToken({
  name: "RCurly",
  pattern: /}/,
  label: "}",
});

// [
export const LSquare = createUniqToken({
  name: "LSquare",
  pattern: /\[/,
  label: "[",
});

// ]
export const RSquare = createUniqToken({
  name: "RSquare",
  pattern: /]/,
  label: "]",
});

// (
export const LParent = createUniqToken({
  name: "LParent",
  pattern: /\(/,
  label: "(",
});

// )
export const RParent = createUniqToken({
  name: "RParent",
  pattern: /\)/,
  label: ")",
});

// ?
export const Question = createUniqToken({
  name: "Question",
  pattern: /\?/,
  label: "?",
});

// :
export const ColonToken = createUniqToken({
  name: "ColonToken",
  pattern: /:/,
  label: ":",
});

// |
export const PipeToken = createUniqToken({
  name: "PipeToken",
  pattern: /\|/,
  label: "|",
});

// ,
export const CommaToken = createUniqToken({
  name: "CommaToken",
  pattern: /,/,
  label: ",",
});

// &&
export const AndTestToken = createUniqToken({
  name: "AndTestToken",
  pattern: /&&/,
  label: "&&",
});

// ??
export const NullishCoalescingToken = createUniqToken({
  name: "NullishCoalescingToken",
  pattern: /\?\?/,
  label: "??",
});

// ||
export const OrTestToken = createUniqToken({
  name: "OrTestToken",
  pattern: /\|\|/,
  label: "||",
});

// Database Logic tokens

// "between"
export const JsonBetweenToken = createUniqToken({
  name: "JsonBetweenToken",
  pattern: /between/,
  label: "between",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "@>"
export const JsonContainsToken = createUniqToken({
  name: "JsonContainsToken",
  pattern: /@>/,
  label: "@>",
});

// "contains"
export const JsonContainsStringToken = createUniqToken({
  name: "JsonContainsStringToken",
  pattern: /contains/,
  label: "contains",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "="
export const JsonEqualToken = createUniqToken({
  name: "JsonEqualToken",
  pattern: /=/,
  label: "=",
});

// "ilike"
export const JsonILikeToken = createUniqToken({
  name: "JsonILikeToken",
  pattern: /ilike/,
  label: "ilike",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "includes"
export const JsonIncludesToken = createUniqToken({
  name: "JsonIncludesToken",
  pattern: /includes/,
  label: "includes",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "like"
export const JsonLikeToken = createUniqToken({
  name: "JsonLikeToken",
  pattern: /like/,
  label: "like",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "not between"
export const JsonNotBetweenToken = createUniqToken({
  name: "JsonNotBetweenToken",
  pattern: /not between/,
  label: "not between",
});
// "not contains"
export const JsonNotContainsToken = createUniqToken({
  name: "JsonNotContainsToken",
  pattern: /not contains/,
  label: "not contains",
});

// "not ilike"
export const JsonNotILikeToken = createUniqToken({
  name: "JsonNotILikeToken",
  pattern: /not ilike/,
  label: "not ilike",
});

// "not in"
export const JsonNotInToken = createUniqToken({
  name: "JsonNotInToken",
  pattern: /not in/,
  label: "not in",
});

// "not includes"
export const JsonNotIncludesToken = createUniqToken({
  name: "JsonNotIncludesToken",
  pattern: /not includes/,
  label: "not includes",
});
// "not like"
export const JsonNotLikeToken = createUniqToken({
  name: "JsonNotLikeToken",
  pattern: /not like/,
  label: "not like",
});

// "not overlaps"
export const JsonNotOverlapsToken = createUniqToken({
  name: "JsonNotOverlapsToken",
  pattern: /not overlaps/,
  label: "not overlaps",
});

// "!~" // NotRegex
export const JsonNotRegexToken = createUniqToken({
  name: "JsonNotRegexToken",
  pattern: /!~/,
  label: "!~",
});

// "overlaps"
export const JsonOverlapsToken = createUniqToken({
  name: "JsonOverlapsToken",
  pattern: /overlaps/,
  label: "overlaps",
  longer_alt: Identifier,
  categories: [Identifier],
});

// "~" Regex for JSON
export const JsonRegexToken = createUniqToken({
  name: "JsonRegexToken",
  pattern: /~/,
  label: "~",
});

// "search"
export const JsonSearchToken = createUniqToken({
  name: "JsonSearchToken",
  pattern: /search/,
  label: "search",
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ControlTokens = [
  JsonNotBetweenToken,
  JsonNotContainsToken,
  JsonNotILikeToken,
  JsonNotIncludesToken,
  JsonNotInToken,
  JsonBetweenToken,
  JsonContainsToken,
  JsonContainsStringToken,
  JsonILikeToken,
  JsonIncludesToken,
  JsonLikeToken,
  JsonNotLikeToken,
  JsonNotOverlapsToken,
  JsonNotRegexToken,
  JsonOverlapsToken,
  JsonRegexToken,
  JsonSearchToken,
  NullishCoalescingToken,
  AndTestToken,
  OrTestToken,
  ConditionalToken,
  IfToken,
  ElseifToken,
  ElseToken,
  ForeachToken,
  ForToken,
  EachToken,
  RemoveToken,
  AwaitToken,
  AsToken,
  ReturnToken,
  SwitchToken,
  CaseToken,
  DefaultToken,
  WhileToken,
  GroupToken,
  ThrowToken,
  BreakToken,
  ContinueToken,
  GreaterThanOrEq,
  GreaterThan,
  SmallerThanOrEq,
  SmallerThan,
  Minus,
  Plus,
  Multiply,
  Divide,
  Modulus,
  IsStrictEqual,
  IsEqual,
  IsStrictNotEqual,
  IsNotEqual,
  EqualToken,
  LCurly,
  RCurly,
  LSquare,
  RSquare,
  LParent,
  RParent,
  Question,
  ColonToken,
  PipeToken,
  CommaToken,
  TryCatchToken,
  TryToken,
  CatchToken,
  FinallyToken,
  JsonEqualToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case IfToken.name:
    case ElseToken.name:
    case ElseifToken.name:
    case EachToken.name:
    case AsToken.name:
    case TryToken.name:
    case CatchToken.name:
    case FinallyToken.name:
      return "keyword";

    case ConditionalToken.name:
    case AwaitToken.name:
    case ReturnToken.name:
    case GroupToken.name:
    case ThrowToken.name:
    case BreakToken.name:
    case ContinueToken.name:
    case ForToken.name:
    case SwitchToken.name:
    case RemoveToken.name:
    case ForeachToken.name:
    case WhileToken.name:
    case CaseToken.name:
    case DefaultToken.name:
    case TryCatchToken.name:
      return "function";

    case LCurly.name:
      return "operator.openingCurly";
    case RCurly.name:
      return "operator.closingCurly";
    case LSquare.name:
      return "operator.openingSquare";
    case RSquare.name:
      return "operator.closingSquare";
    case LParent.name:
      return "operator.openingParenthesis";
    case RParent.name:
      return "operator.closingParenthesis";

    case GreaterThan.name:
    case GreaterThanOrEq.name:
    case SmallerThan.name:
    case SmallerThanOrEq.name:
    case Minus.name:
    case Plus.name:
    case AndTestToken.name:
    case OrTestToken.name:
    case Multiply.name:
    case Divide.name:
    case Modulus.name:
    case EqualToken.name:
    case IsEqual.name:
    case IsNotEqual.name:
    case NullishCoalescingToken.name:
    case JsonNotBetweenToken.name:
    case JsonNotContainsToken.name:
    case JsonNotILikeToken.name:
    case JsonNotIncludesToken.name:
    case JsonNotInToken.name:
    case JsonBetweenToken.name:
    case JsonContainsToken.name:
    case JsonContainsStringToken.name:
    case JsonILikeToken.name:
    case JsonIncludesToken.name:
    case JsonLikeToken.name:
    case JsonNotLikeToken.name:
    case JsonNotOverlapsToken.name:
    case JsonNotRegexToken.name:
    case JsonOverlapsToken.name:
    case JsonRegexToken.name:
      return "operator";

    case JsonSearchToken.name:
      return "variable";

    case Question.name:
    case ColonToken.name:
    case PipeToken.name:
    case CommaToken.name:
      return "punctuation";
    default:
      return null;
  }
}
