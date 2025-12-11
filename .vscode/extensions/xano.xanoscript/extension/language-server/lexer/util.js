import { Identifier } from "./identifier.js";
import { createTokenByName } from "./utils.js";

// util
export const UtilToken = createTokenByName("util", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// send_email
export const SendEmailToken = createTokenByName("send_email", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// geo_distance
export const GeoDistanceToken = createTokenByName("geo_distance", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// get_all_input
export const GetAllInputToken = createTokenByName("get_all_input", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// template
export const TemplateToken = createTokenByName("template_engine", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// get_env
export const GetEnvToken = createTokenByName("get_env", {
  longer_alt: Identifier,
  categories: [Identifier],
});
// get_raw_input
export const GetRawInputToken = createTokenByName("get_raw_input", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// get_vars
export const GetVarsToken = createTokenByName("get_vars", {
  longer_alt: Identifier,
  categories: [Identifier],
});
// ip_lookup
export const IpLookupToken = createTokenByName("ip_lookup", {
  longer_alt: Identifier,
  categories: [Identifier],
});
// post_process
export const PostProcessToken = createTokenByName("post_process", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// precondition
export const PreconditionToken = createTokenByName("precondition", {
  longer_alt: Identifier,
  categories: [Identifier],
});

// set_header
export const SetHeaderToken = createTokenByName("set_header", {
  longer_alt: Identifier,
  categories: [Identifier],
});
// sleep
export const SleepToken = createTokenByName("sleep", {
  longer_alt: Identifier,
  categories: [Identifier],
});

export const UtilTokens = [
  UtilToken,
  TemplateToken,
  GeoDistanceToken,
  SendEmailToken,
  GetAllInputToken,
  GetEnvToken,
  GetRawInputToken,
  GetVarsToken,
  IpLookupToken,
  PostProcessToken,
  PreconditionToken,
  SetHeaderToken,
  SleepToken,
];

export function mapTokenToType(token) {
  switch (token) {
    case UtilToken.name:
    case GeoDistanceToken.name:
    case GetAllInputToken.name:
    case GetEnvToken.name:
    case GetRawInputToken.name:
    case GetVarsToken.name:
    case IpLookupToken.name:
    case PostProcessToken.name:
    case PreconditionToken.name:
    case SetHeaderToken.name:
    case SleepToken.name:
    case TemplateToken.name:
    case SendEmailToken.name:
      return "function";
    default:
      return null;
  }
}
