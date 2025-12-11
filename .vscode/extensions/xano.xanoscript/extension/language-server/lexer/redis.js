import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// redis
export const RedisToken = createTokenByName("redis", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// count
export const CountToken = createTokenByName("count", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// decr
export const DecrToken = createTokenByName("decr", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// del
export const DelToken = createTokenByName("del", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// get
export const GetToken = createTokenByName("get", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// has
export const HasToken = createTokenByName("has", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// incr
export const IncrToken = createTokenByName("incr", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// keys
export const KeysToken = createTokenByName("keys", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// pop
export const PopToken = createTokenByName("pop", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// push
export const PushToken = createTokenByName("push", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// range
export const RangeToken = createTokenByName("range", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// ratelimit
export const RatelimitToken = createTokenByName("ratelimit", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// remove
export const RemoveToken = createTokenByName("remove", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// set
export const SetToken = createTokenByName("set", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// shift
export const ShiftToken = createTokenByName("shift", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// unshift
export const UnshiftToken = createTokenByName("unshift", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const RedisTokens = [
  RedisToken,
  CountToken,
  DecrToken,
  DelToken,
  GetToken,
  HasToken,
  IncrToken,
  KeysToken,
  PopToken,
  PushToken,
  RangeToken,
  RatelimitToken,
  RemoveToken,
  SetToken,
  ShiftToken,
  UnshiftToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case RedisToken.name:
    case CountToken.name:
    case DecrToken.name:
    case DelToken.name:
    case GetToken.name:
    case HasToken.name:
    case IncrToken.name:
    case KeysToken.name:
    case PopToken.name:
    case PushToken.name:
    case RangeToken.name:
    case RatelimitToken.name:
    case RemoveToken.name:
    case SetToken.name:
    case ShiftToken.name:
    case UnshiftToken.name:
      return "function";
    default:
      return null;
  }
}
