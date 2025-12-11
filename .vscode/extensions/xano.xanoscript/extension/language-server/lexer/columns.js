import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

export const IntToken = createTokenByName("int", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const TimestampToken = createTokenByName("timestamp", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const TextToken = createTokenByName("text", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const UuidToken = createTokenByName("uuid", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const VectorToken = createTokenByName("vector", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const EnumToken = createTokenByName("enum", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const DateToken = createTokenByName("date", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const BoolToken = createTokenByName("bool", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const DecimalToken = createTokenByName("decimal", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const EmailToken = createTokenByName("email", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const PasswordToken = createTokenByName("password", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const JsonToken = createTokenByName("json", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const FileToken = createTokenByName("file", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ObjectToken = createTokenByName("object", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ImageToken = createTokenByName("image", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const VideoToken = createTokenByName("video", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const AudioToken = createTokenByName("audio", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const AttachmentToken = createTokenByName("attachment", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_point
export const GeoPointToken = createTokenByName("geo_point", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_multipoint
export const GeoMultipointToken = createTokenByName("geo_multipoint", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_linestring
export const GeoLinestringToken = createTokenByName("geo_linestring", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_multilinestring
export const GeoMultilinestringToken = createTokenByName(
  "geo_multilinestring",
  {
    longer_alt: Identifier,
    categories: [Identifier],
  }
);

// geo_polygon
export const GeoPolygonToken = createTokenByName("geo_polygon", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_multipolygon
export const GeoMultipolygonToken = createTokenByName("geo_multipolygon", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// dblink
export const DblinkToken = createTokenByName("dblink", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// agent
export const AgentToken = createTokenByName("agent", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// mcp_server
export const McpServerToken = createTokenByName("mcp_server", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// channel
export const ChannelToken = createTokenByName("channel", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// canonical
export const CanonicalToken = createTokenByName("canonical", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const ColumnTokens = [
  AgentToken,
  CanonicalToken,
  McpServerToken,
  ChannelToken,
  DblinkToken,
  IntToken,
  TimestampToken,
  TextToken,
  UuidToken,
  VectorToken,
  EnumToken,
  DateToken,
  BoolToken,
  DecimalToken,
  EmailToken,
  PasswordToken,
  JsonToken,
  FileToken,
  ObjectToken,
  ImageToken,
  VideoToken,
  AudioToken,
  AttachmentToken,
  GeoPointToken,
  GeoMultipointToken,
  GeoLinestringToken,
  GeoMultilinestringToken,
  GeoPolygonToken,
  GeoMultipolygonToken,
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case AgentToken.name:
    case CanonicalToken.name:
    case McpServerToken.name:
    case ChannelToken.name:
    case DblinkToken.name:
    case IntToken.name:
    case TimestampToken.name:
    case TextToken.name:
    case UuidToken.name:
    case VectorToken.name:
    case EnumToken.name:
    case DateToken.name:
    case BoolToken.name:
    case DecimalToken.name:
    case EmailToken.name:
    case PasswordToken.name:
    case JsonToken.name:
    case FileToken.name:
    case ObjectToken.name:
    case ImageToken.name:
    case VideoToken.name:
    case AudioToken.name:
    case AttachmentToken.name:
    case GeoPointToken.name:
    case GeoMultipointToken.name:
    case GeoLinestringToken.name:
    case GeoMultilinestringToken.name:
    case GeoPolygonToken.name:
    case GeoMultipolygonToken.name:
      return "type";
    default:
      return null;
  }
}
