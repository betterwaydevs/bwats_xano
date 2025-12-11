import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// "array"
export const ArrayToken = createTokenByName("array", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.every"
export const EveryToken = createTokenByName("every", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.filter_count"
export const FilterCountToken = createTokenByName("filter_count", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.filter"
export const FilterToken = createTokenByName("filter", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.find"
export const FindToken = createTokenByName("find", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.find_index"
export const FindIndexToken = createTokenByName("find_index", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.has"
export const HasToken = createTokenByName("has", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.merge"
export const MergeToken = createTokenByName("merge", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.pop"
export const PopToken = createTokenByName("pop", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.push"
export const PushToken = createTokenByName("push", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.shift"
export const ShiftToken = createTokenByName("shift", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.unshift"
export const UnshiftToken = createTokenByName("unshift", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.map"
export const MapToken = createTokenByName("map", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.partition"
export const PartitionToken = createTokenByName("partition", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// array.group_by
export const GroupByToken = createTokenByName("group_by", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.difference"
export const DifferenceToken = createTokenByName("difference", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.intersection"
export const IntersectionToken = createTokenByName("intersection", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// "array.union"
export const UnionToken = createTokenByName("union", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ArrayFnTokens = [
  ArrayToken,
  EveryToken,
  FilterCountToken,
  FilterToken,
  FindIndexToken,
  FindToken,
  HasToken,
  MergeToken,
  PopToken,
  PushToken,
  ShiftToken,
  UnshiftToken,
  MapToken,
  PartitionToken,
  GroupByToken,
  DifferenceToken,
  IntersectionToken,
  UnionToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case ArrayToken.name:
    case EveryToken.name:
    case FilterCountToken.name:
    case FilterToken.name:
    case FindToken.name:
    case FindIndexToken.name:
    case HasToken.name:
    case MergeToken.name:
    case PopToken.name:
    case PushToken.name:
    case ShiftToken.name:
    case UnshiftToken.name:
    case MapToken.name:
    case PartitionToken.name:
    case GroupByToken.name:
    case DifferenceToken.name:
    case IntersectionToken.name:
    case UnionToken.name:
      return "function";
    default:
      return null;
  }
}
