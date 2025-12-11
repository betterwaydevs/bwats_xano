import { createUniqToken } from "./utils.js";

export const ShortFormVariable = createUniqToken({
  name: "ShortFormVariable",
  pattern: /(\$[a-zA-Z_]\w*)|(\$\$)/,
  label: "$",
});

export const ResponseVariable = createUniqToken({
  name: "ResponseVariable",
  pattern: /\$response/,
  label: "$response",
  categories: [ShortFormVariable],
  longer_alt: ShortFormVariable,
});

export const LongFormVariable = createUniqToken({
  name: "LongFormVariable",
  pattern: /\$var/,
  label: "$var",
  longer_alt: ShortFormVariable, // allow $variable to be matched as short form variable
});

// $this
export const ContentThisToken = createUniqToken({
  name: "$this",
  pattern: /\$this/,
  longer_alt: ShortFormVariable,
  categories: [ShortFormVariable],
});

export const InputVariable = createUniqToken({
  name: "InputVariable",
  pattern: /\$input/,
  longer_alt: ShortFormVariable,
});

export const EnvVariable = createUniqToken({
  name: "EnvVariable",
  pattern: /\$env/,
  label: "$env",
  longer_alt: ShortFormVariable,
});

export const AuthVariable = createUniqToken({
  name: "AuthVariable",
  pattern: /\$auth/,
  label: "$auth",
  longer_alt: ShortFormVariable,
});

export const RemoteIpVariable = createUniqToken({
  name: "$remote_ip",
  pattern: /\$remote_ip/,
  longer_alt: ShortFormVariable,
});

// $tenant
export const TenantVariable = createUniqToken({
  name: "$tenant",
  pattern: /\$tenant/,
  longer_alt: ShortFormVariable,
});

export const ErrorVariable = createUniqToken({
  name: "$error",
  pattern: /\$error/,
  longer_alt: ShortFormVariable,
});

export const RemotePortVariable = createUniqToken({
  name: "$remote_port",
  pattern: /\$remote_port/,
  longer_alt: ShortFormVariable,
});

export const RemoteUserVariable = createUniqToken({
  name: "$remote_user",
  pattern: /\$remote_user/,
  longer_alt: ShortFormVariable,
});

// $http_headers
export const HttpHeadersVariable = createUniqToken({
  name: "$http_headers",
  pattern: /\$http_headers/,
  longer_alt: ShortFormVariable,
});

// $webflow
export const WebflowVariable = createUniqToken({
  name: "$webflow",
  pattern: /\$webflow/,
  longer_alt: ShortFormVariable,
});

// $api_baseurl
export const ApiBaseUrlVariable = createUniqToken({
  name: "$api_baseurl",
  pattern: /\$api_baseurl/,
  longer_alt: ShortFormVariable,
});

// $request_uri
export const RequestUriVariable = createUniqToken({
  name: "$request_uri",
  pattern: /\$request_uri/,
  longer_alt: ShortFormVariable,
});

// $request_querystring
export const RequestQuerystringVariable = createUniqToken({
  name: "$request_querystring",
  pattern: /\$request_querystring/,
  longer_alt: ShortFormVariable,
});

// $request_auth_token
export const RequestAuthTokenVariable = createUniqToken({
  name: "$request_auth_token",
  pattern: /\$request_auth_token/,
  longer_alt: ShortFormVariable,
});

// $datasource
export const DatasourceVariable = createUniqToken({
  name: "$datasource",
  pattern: /\$datasource/,
  longer_alt: ShortFormVariable,
});

// $branch
export const BranchVariable = createUniqToken({
  name: "$branch",
  pattern: /\$branch/,
  longer_alt: ShortFormVariable,
});

export const RemotePasswordVariable = createUniqToken({
  name: "$remote_passwd",
  pattern: /\$remote_passwd/,
  longer_alt: ShortFormVariable,
});

export const RemoteHostVariable = createUniqToken({
  name: "$remote_host",
  pattern: /\$remote_host/,
  longer_alt: ShortFormVariable,
});

export const RequestMethod = createUniqToken({
  name: "$request_method",
  pattern: /\$request_method/,
  longer_alt: ShortFormVariable,
});

export const VariableTokens = [
  ResponseVariable,
  ContentThisToken,
  LongFormVariable,
  InputVariable,
  EnvVariable,
  AuthVariable,
  ErrorVariable,
  RemoteIpVariable,
  TenantVariable,
  RemotePortVariable,
  RemoteUserVariable,
  RemotePasswordVariable,
  RemoteHostVariable,
  RequestMethod,
  HttpHeadersVariable,
  WebflowVariable,
  ApiBaseUrlVariable,
  RequestUriVariable,
  RequestQuerystringVariable,
  RequestAuthTokenVariable,
  DatasourceVariable,
  BranchVariable,
  ShortFormVariable, // short form should be last to avoid conflicts with $env, $auth, etc.
];

/**
 * Maps a token name to a type
 * @param {string} token the token name
 */
export function mapTokenToType(token) {
  switch (token) {
    case InputVariable.name:
    case ErrorVariable.name:
    case EnvVariable.name:
    case AuthVariable.name:
    case RemoteIpVariable.name:
    case TenantVariable.name:
    case RemotePortVariable.name:
    case RemoteUserVariable.name:
    case RemotePasswordVariable.name:
    case RemoteHostVariable.name:
    case RequestMethod.name:
    case ResponseVariable.name:
    case LongFormVariable.name:
    case HttpHeadersVariable.name:
    case WebflowVariable.name:
    case ApiBaseUrlVariable.name:
    case RequestUriVariable.name:
    case RequestQuerystringVariable.name:
    case RequestAuthTokenVariable.name:
    case DatasourceVariable.name:
    case BranchVariable.name:
      return "enumMember";
    case ContentThisToken.name:
    case ShortFormVariable.name:
      return "variable";
    default:
      return null;
  }
}
